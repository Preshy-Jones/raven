import { NextFunction, Request, Response } from "express";
import { successResponse } from "../utils";
import {
  GenerateVirtualAccountNumberInput,
  LookUpAccountInput,
  TransferInput,
} from "../validation/transaction.schema";
import { Wallet } from "../database/models/Wallet";
import { Transaction } from "../database/models/Transaction";
import { RavenBankService } from "../lib/raven";
import { db } from "../config/database";
import { User } from "../database/models/User";
import { RavenWebhookPayload } from "../types/global";
import generateCollectionAccount from "../services/transactions/generateCollectionAccountService";
import { VirtualAccount } from "../database/models/VirtualAccount";
import { NotFoundError } from "../errors";
import { TransferService } from "../services/transactions/transferService";

export const getBanksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ravenBank = new RavenBankService();
    const response = await ravenBank.listBanks();
    return res.send(successResponse("Banks retrieved", response.data));
  } catch (error) {
    next(error);
  }
};

export const lookupAccountHandler = async (
  req: Request<{}, {}, LookUpAccountInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bankCode, accountNumber } = req.body;
    const ravenBank = new RavenBankService();
    console.log("bankCode", bankCode);
    console.log("accountNumber", accountNumber);

    const account = await ravenBank.lookupAccount(accountNumber, bankCode);
    return res.send(successResponse("Account retrieved", account));
  } catch (error) {
    next(error);
  }
};

export const transferHandler = async (
  req: Request<{}, {}, TransferInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  const trx = await db.transaction();
  try {
    const { bankCode, accountNumber, accountName, amount } = req.body;
    const userId = req.user;

    const result = await TransferService.initiateTransfer(
      userId,
      { bankCode, accountNumber, accountName, amount },
      trx
    );

    await trx.commit();

    return res.json({
      message: "Transfer successful",
      reference: result.reference,
      newBalance: result.newBalance,
    });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
};

export const ravenWebhookHandler = async (
  req: Request<{}, {}, TransferInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("webhook payload", req.body);
    const payload = req.body as RavenWebhookPayload;
    // Only process collection (deposit) webhooks
    if (payload.type === "collection") {
      try {
        // Find user by virtual account number
        const userVirtualAccount = await VirtualAccount.findOne({
          accountNumber: payload.account_number,
        });
        if (!userVirtualAccount) {
          console.error(
            `No virtual account found for account number ${payload.account_number}`
          );

          throw new NotFoundError("Virtual account not found");
        }

        // Find user by virtual account number
        const user = await User.findById(userVirtualAccount.userId);

        const reference = `DEP_${payload.session_id}`;

        // Check if transaction has already been processed
        const existingTransaction = await Transaction.getByReference(reference);
        if (existingTransaction) {
          return res.json({ message: "Transaction already processed" });
        }

        // Start a database transaction
        await db.transaction(async (trx) => {
          // Create transaction record
          await Transaction.create(
            {
              userId: user.id!,
              type: "DEPOSIT",
              amount: payload.amount,
              status: "COMPLETED",
              reference,
              metadata: {
                session_id: payload.session_id,
                source: payload.source,
                type: payload.type,
              },
            },
            trx
          );

          // Credit user's wallet
          await Wallet.updateBalance(user.id!, payload.amount, trx);
        });

        // Send success response
        res.json({
          success: true,
          message: "Deposit processed successfully",
          reference,
        });
      } catch (error) {
        console.error("Webhook processing error:", error);

        // Still return 200 to acknowledge receipt
        res.status(200).json({
          success: false,
          error: "Error processing webhook",
        });
      }
    }

    return res.send(successResponse("Webhook received", true));
  } catch (error) {
    next(error);
  }
};

export const getWalletBalanceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const balance = await Wallet.getBalance(Number(req.user));
    return res.send(successResponse("Wallet balance retrieved", balance));
  } catch (error) {
    next(error);
  }
};

export const generateNewCollectionAccountHandler = async (
  req: Request<{}, {}, GenerateVirtualAccountNumberInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount } = req.body;
    const user = req.user;
    const virtualAccount = await generateCollectionAccount(user, amount);
    return res.send(
      successResponse("Account number generated", virtualAccount)
    );
  } catch (error) {
    next(error);
  }
};
