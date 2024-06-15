import { createId } from "@paralleldrive/cuid2";
import {
	text,
	sqliteTable,
	real,
	integer,
	unique,
} from "drizzle-orm/sqlite-core";

/**
 * The webinar assistants.
 */
export const assistants = sqliteTable("assistants", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	email: text("email", { length: 50 }).notNull().unique(),
	fullName: text("full_name", { length: 50 }).notNull(),
	company: text("company", { length: 50 }),
	position: text("position", { length: 50 }),
	interests: text("interests"),
	isConfirmed: integer("is_confirmed", { mode: "boolean" })
		.notNull()
		.default(false),
});

/**
 * The assignments for the participants.
 */
export const assignments = sqliteTable("assignments", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	title: text("title", { length: 50 }).notNull(),
	weighting: real("weighting").notNull().default(0),
});

/**
 * The webinar participants.
 */
export const participants = sqliteTable("participants", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	fullName: text("full_name", { length: 50 }).notNull(),
	role: text("role", { length: 50 }).notNull(),
	cvUrl: text("cv_url").notNull(),
});

/**
 * The deliveries a participant made for an assigment.
 */
export const deliveries = sqliteTable(
	"deliveries",
	{
		id: text("id")
			.$defaultFn(() => createId())
			.primaryKey(),
		participantId: text("participant_id", { length: 50 })
			.notNull()
			.references(() => participants.id, {
				onDelete: "cascade",
			}),
		assignmentId: text("assignment_id", { length: 50 })
			.notNull()
			.references(() => assignments.id, {
				onDelete: "cascade",
			}),
		score: real("score").notNull(),
		url: text("url"),
	},
	(table) => ({
		participantAssignment: unique().on(table.assignmentId, table.participantId),
	}),
);
