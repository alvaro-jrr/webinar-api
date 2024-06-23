import { Hono } from "hono";

import { assistantMiddleware } from "@/middlewares/assistant-middleware";
import { authMiddleware } from "@/middlewares/auth-middleware";

import { AssistantController } from "@/controllers/assistants";

export const assistantsRouter = new Hono();

// Create an assistant.
assistantsRouter.post("/", AssistantController.create);

// Confirm an assistant.
assistantsRouter.post(
	"/confirm-email",
	...assistantMiddleware,
	AssistantController.confirmEmail,
);

// Get assistants.
assistantsRouter.get("/", ...authMiddleware, AssistantController.getAll);

// Get an assistant.
assistantsRouter.get("/:id", ...authMiddleware, AssistantController.getById);

// Delete an assistant.
assistantsRouter.delete("/:id", ...authMiddleware, AssistantController.delete);

// Update an assistant.
assistantsRouter.put("/:id", ...authMiddleware, AssistantController.update);
