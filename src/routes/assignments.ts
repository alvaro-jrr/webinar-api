import { Hono } from "hono";

import { authMiddleware } from "@/middlewares/auth-middleware";

import { AssignmentController } from "@/controllers/assignments";

export const assignmentsRouter = new Hono();

assignmentsRouter.get("/", AssignmentController.getAll);
assignmentsRouter.get("/remaining", AssignmentController.getRemainingWeighting);

assignmentsRouter.use(...authMiddleware).post("/", AssignmentController.create);

assignmentsRouter
	.use(...authMiddleware)
	.get("/:id", AssignmentController.getById);

assignmentsRouter
	.use(...authMiddleware)
	.delete("/:id", AssignmentController.delete);

assignmentsRouter
	.use(...authMiddleware)
	.put("/:id", AssignmentController.update);
