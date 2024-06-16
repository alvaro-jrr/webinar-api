import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { deliveries } from "@/database/schema";

export const insertDeliverySchema = createInsertSchema(deliveries, {
	assignmentId: (schema) => schema.assignmentId.uuid(),
	participantId: (schema) => schema.participantId.uuid(),
	score: (schema) => schema.score.gte(0).lte(100),
	url: (schema) => schema.url.url().optional(),
});

export type InsertDelivery = z.infer<typeof insertDeliverySchema>;
