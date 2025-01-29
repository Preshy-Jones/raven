import { db } from "../../config/database";
import { BaseModel } from "./BaseModel";

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
  createdAt?: Date;
  updatedAt?: Date;
}

export class Transaction extends BaseModel {
  protected static tableName = "transactions";

  static async create(
    transactionData: Omit<ITransaction, "id" | "createdAt" | "updatedAt">
  ): Promise<ITransaction> {
    const [id] = await db(this.tableName).insert(transactionData);
    return this.findById(id);
  }

  static async updateStatus(
    reference: string,
    status: TransactionStatus,
    metadata?: Record<string, any>
  ): Promise<void> {
    await db(this.tableName)
      .where({ reference })
      .update({
        status,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        updatedAt: new Date(),
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
