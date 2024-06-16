import { Hono } from "hono";

import { authMiddleware } from "@/middlewares/auth-middleware";

import { DeliveryController } from "@/controllers/deliveries";

export const deliveriesRouter = new Hono();

deliveriesRouter.get("/", DeliveryController.getAll);

deliveriesRouter.use(...authMiddleware).post("/", DeliveryController.create);

deliveriesRouter
	.use(...authMiddleware)
	.post("/many", DeliveryController.createMany);

deliveriesRouter.use(...authMiddleware).get("/:id", DeliveryController.getById);

deliveriesRouter
	.use(...authMiddleware)
	.delete("/:id", DeliveryController.delete);

deliveriesRouter.use(...authMiddleware).put("/:id", DeliveryController.update);
deliveriesRouter.use(...authMiddleware).put("/many", DeliveryController.update);
