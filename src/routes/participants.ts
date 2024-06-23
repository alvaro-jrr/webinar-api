import { Hono } from "hono";

import { authMiddleware } from "@/middlewares/auth-middleware";

import { ParticipantController } from "@/controllers/participants";

export const participantsRouter = new Hono();

// Get participants.
participantsRouter.get("/", ParticipantController.getAll);

// Get a participant.
participantsRouter.get("/:id", ParticipantController.getById);

// Get a participant deliveries.
participantsRouter.get("/:id/deliveries", ParticipantController.getDeliveries);

// Get the assignments with the participant delivery.
participantsRouter.get(
	"/:id/assignments/delivery",
	ParticipantController.getAssignmentsDelivery,
);

// Creates a participant.
participantsRouter.post("/", ...authMiddleware, ParticipantController.create);

// Deletes a participant.
participantsRouter.delete(
	"/:id",
	...authMiddleware,
	ParticipantController.delete,
);

// Update a participant.
participantsRouter.put("/:id", ...authMiddleware, ParticipantController.update);
