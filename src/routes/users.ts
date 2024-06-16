import { authMiddleware } from "@/middlewares/auth-middleware";
import { Hono } from "hono";

import { UserController } from "@/controllers/users";

export const usersRouter = new Hono();
usersRouter.use("*", ...authMiddleware);

usersRouter.post("/", UserController.create);
