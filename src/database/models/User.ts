import { db } from "../../config/database";
import { BaseModel } from "./BaseModel";
import bcrypt from "bcrypt";

export interface IUser {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  ravenBankAccountNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends BaseModel {
  protected static tableName = "users";

  static async create(
    userData: Omit<IUser, "id" | "createdAt" | "updatedAt">
  ): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const [id] = await db(this.tableName).insert({
      ...userData,
      password: hashedPassword,
    });

    return this.findById(id);
  }

  static async findByEmail(email: string): Promise<IUser | undefined> {
    return this.findOne({ email });
  }

  static async findById(id: number): Promise<IUser | undefined> {
    return db(this.tableName).where({ id }).first();
  }

  static async updateRavenAccount(
    userId: string,
    accountNumber: string
  ): Promise<void> {
    await db(this.tableName).where({ id: userId }).update({
      ravenBankAccountNumber: accountNumber,
      updatedAt: new Date(),
    });
  }

  static async verifyPassword(user: IUser, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
