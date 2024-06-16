import { InferSelectModel } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { deliveries } from "@/database/schema";

/**
 * The schema to insert a delivery.
 */
export const insertDeliverySchema = createInsertSchema(deliveries, {
	score: (schema) => schema.score.gte(0).lte(10),
	url: (schema) => schema.url.url().optional(),
});

export type InsertDelivery = z.infer<typeof insertDeliverySchema>;

/**
 * The schema to update a delivery.
 */
export const updateDeliverySchema = insertDeliverySchema
	.omit({
		id: true,
	})
	.partial();

export type UpdateDelivery = z.infer<typeof updateDeliverySchema> & {
	id: string;
};

/**
 * The schema to update multiple deliveries.
 */
export const updateManyDeliveriesSchema = insertDeliverySchema
	.partial()
	.extend({
		id: z.string(),
	})
	.array()
	.min(1);

export type UpdateManyDeliveries = z.infer<typeof updateManyDeliveriesSchema>;

/**
 * The base delivery type.
 */
export type Delivery = InferSelectModel<typeof deliveries>;
