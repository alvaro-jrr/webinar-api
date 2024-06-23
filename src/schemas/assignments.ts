import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { assignments } from "@/database/schema";

/**
 * The schema to insert an assignment.
 */
export const insertAssignmentSchema = createInsertSchema(assignments, {
	title: (schema) => schema.title.min(1).max(100),
	weighting: (schema) => schema.weighting.gt(0).lte(100),
	date: (schema) => schema.date.date(),
});

export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;

/**
 * The schema to update an assignment.
 */
export const updateAssignmentSchema = insertAssignmentSchema
	.omit({
		id: true,
	})
	.partial();

export type UpdateAssignment = z.infer<typeof updateAssignmentSchema> & {
	id: string;
};
