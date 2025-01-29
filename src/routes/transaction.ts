import express from "express";
import { SignUpSchema } from "../validation/user.schema";
import {
  signupHandler,
} from "../controllers/userController";
import validateResource from "../middlewares/validateResource";

const router = express.Router();

router.post("/transfers", validateResource(SignUpSchema), transferHandler);
router.post("/raven-webhook", validateResource(SignUpSchema), ravenWebhookHandler);

export default router;
