import { db } from "../config/database";
import { Transaction } from "../database/models/Transaction";
import { Wallet } from "../database/models/Wallet";
import { RavenBankService } from "../lib/raven";
import { TransferService } from "../services/transactions/transferService";

jest.mock("../../src/lib/raven");

describe("TransferService", () => {
  let mockUser: any;

  beforeAll(async () => {
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db("users").insert({
      email: "test@example.com",
      password: "hashed",
      firstName: "Test",
      lastName: "User",
      phoneNumber: "1234567890",
    });

    mockUser = await db("users").first();
    await Wallet.createForUser(mockUser.id);
    await Wallet.updateBalance(mockUser.id, 1000);
  });

  afterEach(async () => {
    await db("transactions").del();
    await db("wallets").del();
    await db("users").del();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe("initiateTransfer", () => {
    it("should successfully transfer funds", async () => {
      const mockTransfer = jest
        .spyOn(RavenBankService.prototype, "initiateTransfer")
        .mockResolvedValue({
          status: "success",
          message: "Transfer successful",
        });

      const result = await TransferService.initiateTransfer(mockUser.id, {
        bankCode: "001",
        accountNumber: "1234567890",
        accountName: "Test User",
        amount: 100,
      });

      expect(mockTransfer).toHaveBeenCalled();
      expect(result.reference).toBeDefined();

      const transaction = await Transaction.getByReference(result.reference);
      expect(transaction?.status).toBe("COMPLETED");
    });
  });
});
