import { Hono } from "hono";

import { authMiddleware } from "@/middlewares/auth-middleware";

import { AssignmentController } from "@/controllers/assignments";

export const assignmentsRouter = new Hono();

// Get assignments.
assignmentsRouter.get("/", AssignmentController.getAll);

// Get remaining weighting to evaluate.
assignmentsRouter.get("/remaining", AssignmentController.getRemainingWeighting);

// Create an assignment.
assignmentsRouter.post("/", ...authMiddleware, AssignmentController.create);

// Get an assignment.
assignmentsRouter.get("/:id", ...authMiddleware, AssignmentController.getById);

// Delete an assignment.
assignmentsRouter.delete(
	"/:id",
	...authMiddleware,
	AssignmentController.delete,
);

// Update an assignment.
assignmentsRouter.put("/:id", ...authMiddleware, AssignmentController.update);
