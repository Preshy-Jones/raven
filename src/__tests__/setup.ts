import { db } from "../config/database";

beforeAll(async () => {
  process.env.DATABASE_URL = "mysql://root:@localhost:3306/raven";
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});
