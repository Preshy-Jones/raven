import { db } from "../../config/database";

export class BaseModel {
  protected static tableName: string;

  protected static async findById(id: number) {
    return await db(this.tableName).where({ id }).first();
  }

  protected static async findOne(filter: Record<string, any>) {
    return await db(this.tableName).where(filter).first();
  }

  protected static async findMany(filter: Record<string, any>) {
    return await db(this.tableName).where(filter);
  }
}
