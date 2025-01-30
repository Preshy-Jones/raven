import request from "supertest";
import { db } from "../config/database";
import createServer from "../utils/createServer";

const app = createServer();
describe("User Routes", () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db("users").del();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe("POST /api/user/signup", () => {
    it("should create a new user", async () => {
      const response = await request(app).post("/api/user/signup").send({
        email: "new@example.com",
        password: "password",
        firstName: "New",
        lastName: "User",
        phoneNumber: "1234567890",
      });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty("id");
    });
  });
});
