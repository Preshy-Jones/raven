import { db } from "../../config/database";
import { BaseModel } from "./BaseModel";
import { Knex } from "knex";

export interface IVirtualAccount {
  id?: number;
  userId: number;
  accountNumber: string;
  accountName: string;
  bankName: string;
  amount: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: Date;
  updatedAt?: Date;
}

export class VirtualAccount extends BaseModel {
  protected static tableName = "virtual_accounts";

  static async createForUser(
    userId: number,
    accountData: Omit<
      IVirtualAccount,
      "id" | "userId" | "status" | "createdAt" | "updatedAt"
    >,
    trx?: Knex.Transaction
  ): Promise<IVirtualAccount> {
    const queryBuilder = trx ? trx(this.tableName) : db(this.tableName);
    const [id] = await queryBuilder.insert({
      ...accountData,
      userId,
      status: "ACTIVE",
    });
    return this.findById(id, trx);
  }

  static async getUserAccounts(userId: number): Promise<IVirtualAccount[]> {
    return this.findMany({ userId });
  }

  static async deactivateAccount(accountId: number): Promise<void> {
    await db(this.tableName)
      .where({ id: accountId })
      .update({ status: "INACTIVE", updatedAt: new Date() });
  }
}
