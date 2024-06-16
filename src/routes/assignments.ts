import { Hono } from "hono";

import { authMiddleware } from "@/middlewares/auth-middleware";

import { AssignmentController } from "@/controllers/assignments";

export const assignmentsRouter = new Hono();

// Get assignments.
assignmentsRouter.get("/", AssignmentController.getAll);

// Get remaining weighting to evaluate.
assignmentsRouter.get("/remaining", AssignmentController.getRemainingWeighting);

// Create an assignment.
assignmentsRouter.use(...authMiddleware).post("/", AssignmentController.create);

// Get an assignment.
assignmentsRouter
	.use(...authMiddleware)
	.get("/:id", AssignmentController.getById);

// Delete an assignment.
assignmentsRouter
	.use(...authMiddleware)
	.delete("/:id", AssignmentController.delete);

// Update an assignment.
assignmentsRouter
	.use(...authMiddleware)
	.put("/:id", AssignmentController.update);
