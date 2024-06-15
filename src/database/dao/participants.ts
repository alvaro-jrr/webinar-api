import { InsertParticipant } from "@/schemas/participants";

import { db } from "../client";
import { participants } from "../schema";

export class ParticipantDao {
	/**
	 * Creates a participant.
	 *
	 * @param participant - The participant to insert.
	 *
	 * @returns The created participant on success.
	 */
	static async create(participant: InsertParticipant) {
		const [insertedParticipant] = await db
			.insert(participants)
			.values(participant)
			.returning();

		return insertedParticipant;
	}

	/**
	 * Returns the participants.
	 *
	 * @param params - The query params.
	 *
	 * @returns The participants.
	 */
	static async getAll({
		page = 1,
		count,
	}: Partial<{ page: number; count: number }>) {
		return db.query.participants.findMany({
			limit: count,
			offset: count ? (page - 1) * count : undefined,
			orderBy: (participants, { asc }) => asc(participants.fullName),
		});
	}

	/**
	 * Returns the participant with the id.
	 *
	 * @param id - The participant id.
	 *
	 * @returns The participant on success.
	 */
	static async getById(id: string) {
		return db.query.participants.findFirst({
			where: (participants, { eq }) => eq(participants.id, id),
		});
	}
}
