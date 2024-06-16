import { Hono } from "hono";

import { authMiddleware } from "@/middlewares/auth-middleware";

import { AuthController } from "@/controllers/auth";

export const authRouter = new Hono();

authRouter.post("/login", AuthController.login);

authRouter
	.use(...authMiddleware)
	.get("/check-status", AuthController.checkStatus);
