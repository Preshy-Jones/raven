import { NextFunction, Request, Response } from "express";
export const transferHandler = async (
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
