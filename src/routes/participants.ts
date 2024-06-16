import { Hono } from "hono";

import { authMiddleware } from "@/middlewares/auth-middleware";

import { ParticipantController } from "@/controllers/participants";

export const participantsRouter = new Hono();

participantsRouter.get("/", ParticipantController.getAll);
participantsRouter.get("/:id", ParticipantController.getById);

participantsRouter
	.use(...authMiddleware)
	.post("/", ParticipantController.create);

participantsRouter
	.use(...authMiddleware)
	.delete("/:id", ParticipantController.delete);

participantsRouter
	.use(...authMiddleware)
	.put("/:id", ParticipantController.update);
