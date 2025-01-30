import express from "express";
import { SignUpSchema } from "../validation/user.schema";
import {
  getLoggedInUserHandler,
  signupHandler,
} from "../controllers/userController";
import validateResource from "../middlewares/validateResource";
import ensureAuthenticated from "../middlewares/auth";

const router = express.Router();

router.post("/signup", validateResource(SignUpSchema), signupHandler);

router.get("/me", ensureAuthenticated, getLoggedInUserHandler);

export default router;
