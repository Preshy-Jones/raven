import express from "express";
import { loginHandler } from "../controllers/authController";


import { LoginSchema } from "../validation/auth.schema";
import { SignUpSchema } from "../validation/user.schema";
import {
  getLoggedInUserHandler,
  signupHandler,
} from "../controllers/userController";
// import ensureAuthenticated from "../middlewares/auth";
import validateResource from "../middlewares/validateResource";

const router = express.Router();

router.post("/signup", validateResource(SignUpSchema), signupHandler);

// router.get("/me", ensureAuthenticated, getLoggedInUserHandler);

export default router;
