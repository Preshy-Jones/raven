import jwt from "jsonwebtoken";

import { db } from "../../config/database";
import { IUser, User } from "../../database/models/User";

export async function createTestUser(
  userData?: Partial<IUser>
): Promise<IUser> {
  const defaultUser = {
    email: `test-${Date.now()}@example.com`,
    password: "password123",
    firstName: "Test",
    lastName: "User",
    ravenBankAccountNumber: `TEST${Date.now()}`,
  };

  const testUser = await User.create({
    ...defaultUser,
    ...userData,
  });

  return testUser;
}

export function generateTestToken(user: IUser): string {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || "test-secret",
    { expiresIn: "24h" }
  );
}
