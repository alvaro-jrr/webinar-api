import { Hono } from "hono";

import { authMiddleware } from "@/middlewares/auth-middleware";

import { AuthController } from "@/controllers/auth";

export const authRouter = new Hono();

// Login an user.
authRouter.post("/login", AuthController.login);

// Check the user status.
authRouter.get("/check-status", ...authMiddleware, AuthController.checkStatus);
