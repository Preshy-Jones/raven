import { db } from "../../config/database";
import { Knex } from "knex";

export class BaseModel {
  protected static tableName: string;
  protected static primaryKey = "id";

  protected static getQueryBuilder(trx?: Knex.Transaction) {
    return trx ? trx(this.tableName) : db(this.tableName);
  }

  static async findById(id: number, trx?: Knex.Transaction) {
    return await this.getQueryBuilder(trx)
      .where(this.primaryKey, id)
      .first();
  }

  static async findOne(filter: Record<string, any>, trx?: Knex.Transaction) {
    return await this.getQueryBuilder(trx).where(filter).first();
  }

  protected static async findMany(
    filter: Record<string, any>,
    trx?: Knex.Transaction
  ) {
    return await this.getQueryBuilder(trx).where(filter);
  }
}
