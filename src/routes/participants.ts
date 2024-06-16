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

// Creates a participant.
participantsRouter
	.use(...authMiddleware)
	.post("/", ParticipantController.create);

// Deletes a participant.
participantsRouter
	.use(...authMiddleware)
	.delete("/:id", ParticipantController.delete);

// Update a participant.
participantsRouter
	.use(...authMiddleware)
	.put("/:id", ParticipantController.update);
