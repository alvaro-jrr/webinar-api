import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { assignments } from "@/database/schema";

export const insertAssignmentSchema = createInsertSchema(assignments, {
	title: (schema) => schema.title.min(1).max(50),
	weighting: (schema) => schema.weighting.gt(0).lte(100),
});

export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
