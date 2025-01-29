import { NextFunction, Request, Response } from "express";
import { LoginInput } from "../validation/auth.schema";
import { successResponse } from "../utils";
import loginService from "../services/auth/loginService";


export const loginHandler = async (
  req: Request<{}, {}, LoginInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const response = await loginService(email, password);
    return res.send(successResponse("Logged in successfully", response));
  } catch (error) {
    next(error);
  }
};
