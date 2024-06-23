import { Hono } from "hono";

import { authMiddleware } from "@/middlewares/auth-middleware";

import { DeliveryController } from "@/controllers/deliveries";

export const deliveriesRouter = new Hono();

// Get deliveries.
deliveriesRouter.get("/", DeliveryController.getAll);

// Create a delivery.
deliveriesRouter.post("/", ...authMiddleware, DeliveryController.create);

// Create many deliveries.
deliveriesRouter.post(
	"/many",
	...authMiddleware,
	DeliveryController.createMany,
);

// Get a delivery.
deliveriesRouter.get("/:id", ...authMiddleware, DeliveryController.getById);

// Delete a delivery.
deliveriesRouter.delete("/:id", ...authMiddleware, DeliveryController.delete);

// Update a delivery.
deliveriesRouter.put("/:id", ...authMiddleware, DeliveryController.update);

// Update many deliveries.
deliveriesRouter.put("/many", ...authMiddleware, DeliveryController.update);
