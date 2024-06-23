import { eq } from "drizzle-orm";

import { InsertParticipant, UpdateParticipant } from "@/schemas/participants";

import { db } from "../client";
import { participants } from "../schema";
import { AssignmentDao } from "./assignments";

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
	 * Updates a participant.
	 *
	 * @param participant - The participant to update.
	 *
	 * @returns The updated participant.
	 */
	static async update(participant: UpdateParticipant) {
		const [result] = await db
			.update(participants)
			.set(participant)
			.where(eq(participants.id, participant.id))
			.returning();

		return result;
	}

	/**
	 * Deletes a participant.
	 *
	 * @param participantId - The participant to delete.
	 *
	 * @returns Wether the participant was deleted.
	 */
	static async delete(participantId: string) {
		const [result] = await db
			.delete(participants)
			.where(eq(participants.id, participantId))
			.returning();

		return Boolean(result);
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
	}: Partial<{ page: number; count: number }> = {}) {
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
	static async getById(id: string, { assignments } = { assignments: false }) {
		const participant = await db.query.participants.findFirst({
			where: (participants, { eq }) => eq(participants.id, id),
		});

		if (!participant || !assignments) return participant;

		return {
			...participant,
			assignments: await AssignmentDao.getParticipantAssignmentsDelivery(id),
		};
	}

	/**
	 * Wether the participant with the id exists.
	 *
	 * @param id - The participant id.
	 *
	 * @returns Returns a boolean.
	 */
	static async exists(id: string) {
		const participant = await db.query.participants.findFirst({
			columns: {
				id: true,
			},
			where: (participants, { eq }) => eq(participants.id, id),
		});

		return Boolean(participant);
	}
}
