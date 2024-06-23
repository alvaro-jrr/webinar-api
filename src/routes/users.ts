import { Hono } from "hono";

import { authMiddleware } from "@/middlewares/auth-middleware";

import { UserController } from "@/controllers/users";

export const usersRouter = new Hono();
usersRouter.use("*", ...authMiddleware);

// Create an user.
usersRouter.post("/", UserController.create);
