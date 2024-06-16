import { Hono } from "hono";

import { authMiddleware } from "@/middlewares/auth-middleware";

import { DeliveryController } from "@/controllers/deliveries";

export const deliveriesRouter = new Hono();

// Get deliveries.
deliveriesRouter.get("/", DeliveryController.getAll);

// Create a delivery.
deliveriesRouter.use(...authMiddleware).post("/", DeliveryController.create);

// Create many deliveries.
deliveriesRouter
	.use(...authMiddleware)
	.post("/many", DeliveryController.createMany);

// Get a delivery.
deliveriesRouter.use(...authMiddleware).get("/:id", DeliveryController.getById);

// Delete a delivery.
deliveriesRouter
	.use(...authMiddleware)
	.delete("/:id", DeliveryController.delete);

// Update a delivery.
deliveriesRouter.use(...authMiddleware).put("/:id", DeliveryController.update);

// Update many deliveries.
deliveriesRouter.use(...authMiddleware).put("/many", DeliveryController.update);
