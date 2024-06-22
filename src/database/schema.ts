import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
	text,
	sqliteTable,
	real,
	integer,
	unique,
} from "drizzle-orm/sqlite-core";

/**
 * The system users.
 */
export const users = sqliteTable("users", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	email: text("email", { length: 50 }).notNull().unique(),
	fullName: text("full_name", { length: 50 }).notNull(),
	password: text("password", { length: 70 }).notNull(),
});

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
	isConfirmed: integer("is_confirmed", { mode: "boolean" }).notNull(),
	notifyEvent: integer("notify_event", { mode: "boolean" }).notNull(),
});

/**
 * The assignments for the participants.
 */
export const assignments = sqliteTable("assignments", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	title: text("title", { length: 100 }).notNull(),
	weighting: real("weighting").notNull(),
	date: text("date").notNull(),
});

export const assignmentsRelations = relations(assignments, ({ many }) => ({
	deliveries: many(deliveries),
}));

/**
 * The webinar participants.
 */
export const participants = sqliteTable("participants", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	fullName: text("full_name", { length: 50 }).notNull(),
	role: text("role", { length: 50 }).notNull(),
	cvUrl: text("cv_url").unique().notNull(),
	photoUrl: text("photo_url").notNull(),
});

export const participantsRelations = relations(participants, ({ many }) => ({
	deliveries: many(deliveries),
}));

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

export const deliveriesRelations = relations(deliveries, ({ one }) => ({
	participant: one(participants, {
		fields: [deliveries.participantId],
		references: [participants.id],
	}),
	assignment: one(assignments, {
		fields: [deliveries.assignmentId],
		references: [assignments.id],
	}),
}));
