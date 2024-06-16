import { InferSelectModel } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { deliveries } from "@/database/schema";

export const insertDeliverySchema = createInsertSchema(deliveries, {
	score: (schema) => schema.score.gte(0).lte(10),
	url: (schema) => schema.url.url().optional(),
});

export const updateDeliverySchema = insertDeliverySchema
	.omit({
		id: true,
	})
	.partial();

export const updateManyDeliveriesSchema = insertDeliverySchema
	.partial()
	.extend({
		id: z.string(),
	})
	.array()
	.min(1);

export type InsertDelivery = z.infer<typeof insertDeliverySchema>;

export type UpdateDelivery = z.infer<typeof updateDeliverySchema> & {
	id: string;
};

export type UpdateManyDeliveries = z.infer<typeof updateManyDeliveriesSchema>;

export type Delivery = InferSelectModel<typeof deliveries>;
