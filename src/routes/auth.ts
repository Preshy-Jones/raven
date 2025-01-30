import express from "express";
import { loginHandler } from "../controllers/authController";

import validateResource from "../middlewares/validateResource";
import { LoginSchema } from "../validation/auth.schema";

const router = express.Router();

router.post("/login", validateResource(LoginSchema), loginHandler);

export default router;
