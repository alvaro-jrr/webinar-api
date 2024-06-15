import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/database/schema";

export const insertUserSchema = createInsertSchema(users, {
	email: (schema) => schema.email.email(),
	fullName: (schema) => schema.fullName.min(2).max(50),
	password: (schema) => schema.password.min(5).max(70),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export const userCredentialsSchema = z.object({
	email: z.string().email().min(1).max(50),
	password: z.string().min(1).max(70),
});
