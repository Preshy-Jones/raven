import { db } from "../../config/database";

import bcrypt from "bcrypt";
import { Knex } from "knex";
import { BaseModel } from "./BaseModel";

export interface IUser {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  created_at?: Date;
  updated_at?: Date;
}

export class User extends BaseModel {
  protected static tableName = "users";

  static async create(
    userData: Omit<IUser, "id" | "created_at" | "updated_at">,
    trx?: Knex.Transaction
  ): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const queryBuilder = trx ? trx(this.tableName) : db(this.tableName);
    const [id] = await queryBuilder.insert({
      ...userData,
      password: hashedPassword,
    });

    return this.findById(id, trx);
  }

  static async findByEmail(email: string): Promise<IUser | undefined> {
    return this.findOne({ email });
  }

  static async verifyPassword(user: IUser, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
