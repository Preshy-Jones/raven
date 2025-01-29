import { NextFunction, Request, Response } from "express";
import { LoginInput } from "../validation/auth.schema";

import { SignUpInput } from "../validation/user.schema";
import { ConflictError } from "../errors";
import SignUpService from "../services/user/signUpUserServices";
import { User } from "../database/models/User";
import { successResponse } from "../utils";

export const signupHandler = async (
  req: Request<{}, {}, SignUpInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    const user = await SignUpService(req.body);
    return res
      .status(201)
      .send(successResponse("User registered successfully", user));
  } catch (error) {
    next(error);
  }
};

export const getLoggedInUserHandler = async (
  req: Request<{}, {}, SignUpInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user;
  console.log("hello", req.user);

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ConflictError("User not found");
    }
    return res.send(successResponse("User found", user));
  } catch (error) {
    next(error);
  }
};
