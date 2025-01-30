import { Knex } from "knex";
import { RavenBankService } from "../../lib/raven";
import { db } from "../../config/database";
import { ServiceError } from "../../errors";
import { Transaction } from "../../database/models/Transaction";
import { Wallet } from "../../database/models/Wallet";

export class TransferService {
  private static async createTransactionReference(): Promise<string> {
    return `TRF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static async initiateTransfer(
    userId: number,
    transferData: {
      bankCode: string;
      accountNumber: string;
      accountName: string;
      amount: number;
    },
    trx?: Knex.Transaction
  ) {
    const internalTrx = trx || (await db.transaction());
    try {
      const { bankCode, accountNumber, accountName, amount } = transferData;
      const ravenBank = new RavenBankService();

      // Check balance within transaction
      const balance = await Wallet.getBalance(userId);
      if (balance < amount) {
        throw new ServiceError("Insufficient funds");
      }

      console.log("balance", balance);

      // Create transaction reference
      const reference = await this.createTransactionReference();

      // Create pending transaction
      const transaction = await Transaction.create(
        {
          userId,
          type: "TRANSFER",
          amount,
          status: "PENDING",
          reference,
        },
        internalTrx
      );

      // Deduct from wallet
      await Wallet.updateBalance(userId, -amount, internalTrx);

      // Initiate external transfer
      const transferResult = await ravenBank.initiateTransfer({
        amount,
        bank_code: bankCode,
        account_number: accountNumber,
        account_name: accountName,
        reference,
        narration: "Transfer from wallet",
      });

      // Update transaction status
      await Transaction.updateStatus(
        reference,
        "COMPLETED",
        transferResult,
        internalTrx
      );

      if (!trx) await internalTrx.commit();

      return {
        transaction,
        newBalance: balance - amount,
        reference,
      };
    } catch (error) {
      if (!trx) await internalTrx.rollback();

      // Re-throw error for handler to handle
      throw error;
    }
  }
}
