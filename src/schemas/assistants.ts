import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { assistants } from "@/database/schema";

/**
 * The schema to insert an assistant.
 */
export const insertAssistantSchema = createInsertSchema(assistants, {
	email: (schema) => schema.email.min(1).max(50),
	fullName: (schema) => schema.fullName.min(2).max(50),
	company: (schema) => schema.company.max(50).optional(),
	position: (schema) => schema.position.max(50).optional(),
});

export type InsertAssistant = z.infer<typeof insertAssistantSchema>;

/**
 * The schema to update an assistant.
 */
export const updateAssistantSchema = insertAssistantSchema
	.omit({
		id: true,
	})
	.partial();

export type UpdateAssistant = z.infer<typeof updateAssistantSchema> & {
	id: string;
};
