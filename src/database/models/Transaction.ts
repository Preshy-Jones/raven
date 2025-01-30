import { db } from "../../config/database";
import { BaseModel } from "./BaseModel";
import { Knex } from "knex";
export type TransactionType = "DEPOSIT" | "TRANSFER";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface ITransaction {
  id?: number;
  userId: number;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  reference: string;
  metadata?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

export class Transaction extends BaseModel {
  protected static tableName = "transactions";

  static async create(
    transactionData: Omit<ITransaction, "id" | "created_at" | "updated_at">,
    trx?: Knex.Transaction
  ): Promise<ITransaction> {
    const queryBuilder = trx ? trx(this.tableName) : db(this.tableName);
    const [id] = await queryBuilder.insert(transactionData);
    return this.findById(id);
  }

  static async updateStatus(
    reference: string,
    status: TransactionStatus,
    metadata?: Record<string, any>,
    trx?: Knex.Transaction
  ): Promise<void> {
    const queryBuilder = trx ? trx(this.tableName) : db(this.tableName);

    await queryBuilder.where({ reference }).update({
      status,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
      updated_at: new Date(),
    });
  }

  static async getUserTransactions(userId: number): Promise<ITransaction[]> {
    return this.findMany({ userId });
  }

  static async getByReference(
    reference: string
  ): Promise<ITransaction | undefined> {
    return this.findOne({ reference });
  }
}
