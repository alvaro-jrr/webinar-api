import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { participants } from "@/database/schema";

/**
 * The schema to insert a participant.
 */
export const insertParticipantSchema = createInsertSchema(participants, {
	fullName: (schema) => schema.fullName.min(2).max(50),
	cvUrl: (schema) => schema.cvUrl.url(),
	role: (schema) => schema.role.min(1).max(50),
});

export type InsertParticipant = z.infer<typeof insertParticipantSchema>;

/**
 * The schema to update a participant.
 */
export const updateParticipantSchema = insertParticipantSchema
	.omit({
		id: true,
	})
	.partial();

export type UpdateParticipant = z.infer<typeof updateParticipantSchema> & {
	id: string;
};
