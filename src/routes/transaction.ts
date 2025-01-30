import express from "express";
import { SignUpSchema } from "../validation/user.schema";
import { signupHandler } from "../controllers/userController";
import validateResource from "../middlewares/validateResource";
import {
  generateNewCollectionAccountHandler,
  getWalletBalanceHandler,
  ravenWebhookHandler,
  transferHandler,
} from "../controllers/transactionController";
import {
  GenerateVirtualAccountNumberSchema,
  TransferSchema,
} from "../validation/transaction.schema";
import ensureAuthenticated from "../middlewares/auth";
import { validateWebhookSecret } from "../middlewares/webhookAuth";

const router = express.Router();

router.get("/banks", ensureAuthenticated, getWalletBalanceHandler);
router.post("/lookup-account", ensureAuthenticated, getWalletBalanceHandler);
router.post(
  "/transfers",
  [ensureAuthenticated, validateResource(TransferSchema)],
  transferHandler
);
router.post("/raven-webhook", validateWebhookSecret, ravenWebhookHandler);
router.get("/wallet-balance", ensureAuthenticated, getWalletBalanceHandler);
router.post(
  "/generate-collection-account",
  [ensureAuthenticated, validateResource(GenerateVirtualAccountNumberSchema)],
  generateNewCollectionAccountHandler
);

export default router;
