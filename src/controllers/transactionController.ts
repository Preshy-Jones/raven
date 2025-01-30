import { NextFunction, Request, Response } from "express";
import { successResponse } from "../utils";
import {
  GenerateVirtualAccountNumberInput,
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

export const getBanksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ravenBank = new RavenBankService();
    const banks = await ravenBank.listBanks();
    return res.send(successResponse("Banks retrieved", banks));
  } catch (error) {
    next(error);
  }
};

export const lookupAccountHandler = async (
  req: Request<{}, {}, TransferInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bankCode, accountNumber } = req.body;
    const ravenBank = new RavenBankService();
    const account = await ravenBank.lookupAccount(bankCode, accountNumber);
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
  try {
    const { bankCode, accountNumber, accountName, amount } = req.body;
    const userId = req.user.id;
    const ravenBank = new RavenBankService();
    if (amount > 100) {
      return res.status(400).json({ error: "Amount cannot exceed 100 NGN" });
    }

    // Check wallet balance
    const balance = await Wallet.getBalance(userId);
    if (balance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    const reference = `TRF_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create pending transaction
    await Transaction.create({
      userId,
      type: "TRANSFER",
      amount,
      status: "PENDING",
      reference,
    });

    try {
      // Deduct from wallet
      await Wallet.updateBalance(userId, -amount);

      // Initiate transfer
      const transfer = await ravenBank.initiateTransfer({
        amount,
        bank_code: bankCode,
        account_number: accountNumber,
        account_name: accountName,
        reference,
        narration: "Transfer from wallet",
      });

      // Update transaction status
      await Transaction.updateStatus(reference, "COMPLETED", transfer);

      res.json({
        message: "Transfer successful",
        reference,
        newBalance: await Wallet.getBalance(userId),
      });
    } catch (error) {
      // If transfer fails, refund wallet
      await Wallet.updateBalance(userId, amount);
      await Transaction.updateStatus(reference, "FAILED", {
        error: error.message,
      });
      throw error;
    }
  } catch (error) {
    console.error("Transfer error:", error);
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
        const user = await VirtualAccount.findOne({
          accountNumber: payload.account_number,
        });
        if (!user) {
          console.error(
            `No user found for account number: ${payload.account_number}`
          );

          throw new NotFoundError("User not found");
        }

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
    const balance = await Wallet.getBalance(req.user.id);
    res.json({ balance });
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
