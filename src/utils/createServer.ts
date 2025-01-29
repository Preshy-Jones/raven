import "dotenv/config";
import express from "express";
import compression from "compression";
import authRoutes from "../routes/auth";
import userRoutes from "../routes/user";

import passport from "passport";

import { errorHandler, notFoundHandler } from "../middlewares/errors";
import passportStrategy from "../middlewares/passport";
import { db } from "../config/database";

function createServer() {
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(compression());

  app.use(passport.initialize());
  passport.use(passportStrategy);

  app.get("/", (req: Request, res: any) => {
    res.json({
      msg: "Welcome to Raven Api...",
    });
  });

  app.get("/health", async (req, res) => {
    try {
      await db.raw("SELECT 1"); // Test database connection
      res.json({ status: "healthy", database: "connected" });
    } catch (error) {
      res.status(500).json({ status: "unhealthy", database: "disconnected" });
    }
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createServer;
