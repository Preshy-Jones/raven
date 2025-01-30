import { Request, Response, NextFunction } from "express";
import { RavenWebhookPayload } from "../types/global";

export const validateWebhookSecret = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload = req.body as RavenWebhookPayload;

  if (payload.secret !== process.env.RAVEN_WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Invalid webhook secret" });
  }

  next();
};
