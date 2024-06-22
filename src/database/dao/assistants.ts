import { eq } from "drizzle-orm";

import { InsertAssistant, UpdateAssistant } from "@/schemas/assistants";

import { db } from "../client";
import { assistants } from "../schema";

export class AssistantDao {
	/**
	 * Creates an assistant.
	 *
	 * @param assistant - The assistant to insert.
	 *
	 * @returns The created assistant on success.
	 */
	static async create(assistant: InsertAssistant) {
		const [result] = await db.insert(assistants).values(assistant).returning();

		return result;
	}

	/**
	 * Updates an assistant.
	 *
	 * @param assistant - The assistant to update.
	 *
	 * @returns The updated assistant.
	 */
	static async update(assistant: UpdateAssistant) {
		const [result] = await db
			.update(assistants)
			.set(assistant)
			.where(eq(assistants.id, assistant.id))
			.returning();

		return result;
	}

	/**
	 * Deletes an assistant.
	 *
	 * @param assistantId - The assistant to delete.
	 *
	 * @returns Wether the assistant was deleted.
	 */
	static async delete(assistantId: string) {
		const [result] = await db
			.delete(assistants)
			.where(eq(assistants.id, assistantId))
			.returning();

		return Boolean(result);
	}

	/**
	 * Wether the email is already taken.
	 *
	 * @param email - The email to validate.
	 * @returns
	 */
	static async isEmailTaken(email: string) {
		return db.query.assistants.findFirst({
			columns: {
				id: true,
			},
			where: (users, { eq }) => eq(users.email, email),
		});
	}

	/**
	 * Returns the assistants.
	 *
	 * @param params - The query params.
	 *
	 * @returns The assistants.
	 */
	static async getAll({
		page = 1,
		count,
	}: Partial<{ page: number; count: number }> = {}) {
		return db.query.assistants.findMany({
			limit: count,
			offset: count ? (page - 1) * count : undefined,
			orderBy: (assistants, { asc }) => asc(assistants.fullName),
		});
	}

	/**
	 * Returns the assistant with the id.
	 *
	 * @param id - The assistant id.
	 *
	 * @returns The assistant on success.
	 */
	static async getById(id: string) {
		return db.query.assistants.findFirst({
			where: (assistants, { eq }) => eq(assistants.id, id),
		});
	}

	/**
	 * Wether the assistant with the id exists.
	 *
	 * @param id - The assistant id.
	 *
	 * @returns Returns a boolean.
	 */
	static async exists(id: string) {
		const assistant = await db.query.assistants.findFirst({
			columns: {
				id: true,
			},
			where: (assistants, { eq }) => eq(assistants.id, id),
		});

		return Boolean(assistant);
	}
}
