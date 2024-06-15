import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { participants } from "@/database/schema";

export const insertParticipantSchema = createInsertSchema(participants, {
	fullName: (schema) => schema.fullName.min(2).max(50),
	cvUrl: (schema) => schema.cvUrl.url(),
	role: (schema) => schema.role.min(1).max(50),
});

export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
