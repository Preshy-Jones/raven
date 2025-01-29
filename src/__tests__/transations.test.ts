import request from "supertest";

import { db } from "../config/database";
import { createTestUser, generateTestToken } from "./helpers/testUtils";
import { IUser } from "../database/models/User";
import { Transaction } from "../database/models/Transaction";

const app = 

describe("Transactions API", () => {
  let testUser: IUser;
  let authToken: string;

  beforeAll(async () => {
    // Ensure database is in a known state
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  beforeEach(async () => {
    // Create a fresh test user before each test
    testUser = await createTestUser();
    authToken = generateTestToken(testUser);
  });

  afterEach(async () => {
    // Clean up test data
    await db("transactions").where({ userId: testUser.id }).delete();
    await db("users").where({ id: testUser.id }).delete();
  });

  afterAll(async () => {
    // Close database connection
    await db.destroy();
  });

  describe("POST /api/transactions/transfer", () => {
    it("should create a transfer with valid data", async () => {
      const transferData = {
        bankCode: "057",
        accountNumber: "0123456789",
        amount: 50,
      };

      const response = await request(app)
        .post("/api/transactions/transfer")
        .set("Authorization", `Bearer ${authToken}`)
        .send(transferData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("reference");

      // Verify transaction was created in database
      const transaction = await Transaction.getByReference(
        response.body.reference
      );
      expect(transaction).toBeDefined();
      expect(transaction?.userId).toBe(testUser.id);
      expect(transaction?.amount).toBe(transferData.amount);
      expect(transaction?.type).toBe("TRANSFER");
      expect(transaction?.status).toBe("PENDING");
    });

    it("should reject transfers over 100 NGN", async () => {
      const transferData = {
        bankCode: "057",
        accountNumber: "0123456789",
        amount: 150,
      };

      const response = await request(app)
        .post("/api/transactions/transfer")
        .set("Authorization", `Bearer ${authToken}`)
        .send(transferData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("Amount cannot exceed 100 NGN");
    });

    it("should require authentication", async () => {
      const transferData = {
        bankCode: "057",
        accountNumber: "0123456789",
        amount: 50,
      };

      const response = await request(app)
        .post("/api/transactions/transfer")
        .send(transferData);

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/transactions/history", () => {
    it("should return user transaction history", async () => {
      // Create some test transactions
      await Transaction.create({
        userId: testUser.id,
        type: "TRANSFER",
        amount: 50,
        status: "COMPLETED",
        reference: `TEST_${Date.now()}_1`,
      });

      await Transaction.create({
        userId: testUser.id,
        type: "DEPOSIT",
        amount: 100,
        status: "COMPLETED",
        reference: `TEST_${Date.now()}_2`,
      });

      const response = await request(app)
        .get("/api/transactions/history")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty("type");
      expect(response.body[0]).toHaveProperty("amount");
      expect(response.body[0]).toHaveProperty("status");
    });
  });
});
