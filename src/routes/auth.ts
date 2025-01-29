import express from "express";
import { loginHandler } from "../controllers/authController";


import validateResource from "../middlewares/validateResource";
import { LoginSchema } from "../validation/auth.schema";

const router = express.Router();

/**
 * @openapi
 * '/api/auth/login':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Log in a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/LoginUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginUserResponse'

 */
router.post("/login", validateResource(LoginSchema), loginHandler);

export default router;
