import { db } from "../../config/database";
import { BaseModel } from "./BaseModel";
import { Knex } from "knex";

export interface IWallet {
  id?: number;
  userId: number;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Wallet extends BaseModel {
  protected static tableName = "wallets";

  static async createForUser(
    userId: number,
    trx?: Knex.Transaction
  ): Promise<IWallet> {
    const queryBuilder = trx ? trx(this.tableName) : db(this.tableName);
    const [id] = await queryBuilder.insert({
      userId,
      balance: 0,
    });

    return this.findById(id, trx);
  }

  static async getBalance(userId: number): Promise<number> {
    const wallet = await this.findOne({ userId });
    return wallet?.balance || 0;
  }

  static async updateBalance(
    userId: number,
    amount: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const queryBuilder = trx || db;

    await queryBuilder.transaction(async (innerTrx) => {
      const wallet = await innerTrx(this.tableName)
        .where({ userId })
        .select("balance")
        .forUpdate()
        .first();

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const newBalance = Number(wallet.balance) + amount;
      if (newBalance < 0) {
        throw new Error("Insufficient funds");
      }

      await innerTrx(this.tableName).where({ userId }).update({
        balance: newBalance,
        updated_at: new Date(),
      });
    });
  }
}
