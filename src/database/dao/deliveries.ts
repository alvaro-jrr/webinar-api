import { eq, max } from "drizzle-orm";

import { InsertDelivery } from "@/schemas/deliveries";

import { db } from "../client";
import { deliveries } from "../schema";

export class DeliveryDao {
	/**
	 * Creates a delivery.
	 *
	 * @param delivery - The delivery to insert.
	 *
	 * @returns The created delivery on success.
	 */
	static async create(delivery: InsertDelivery) {
		const [insertedDelivery] = await db
			.insert(deliveries)
			.values(delivery)
			.returning();

		return insertedDelivery;
	}

	/**
	 * Returns the deliveries.
	 *
	 * @param params - The query params.
	 *
	 * @returns The deliveries.
	 */
	static async getAll({
		page = 1,
		count,
	}: Partial<{ page: number; count: number }>) {
		return db.query.deliveries.findMany({
			limit: count,
			offset: count ? (page - 1) * count : undefined,
		});
	}

	/**
	 * Returns the delivery with the id.
	 *
	 * @param id - The delivery id.
	 *
	 * @returns The delivery on success.
	 */
	static async getById(id: string) {
		return db.query.deliveries.findFirst({
			where: (deliveries, { eq }) => eq(deliveries.id, id),
		});
	}

	/**
	 * Returns the highest score in the assignment with the id.
	 *
	 * @param assignmentId - The assignment id.
	 *
	 * @returns The score.
	 */
	static async getHighestScore(assignmentId: string) {
		const [result] = await db
			.select({ value: max(deliveries.score) })
			.from(deliveries)
			.where(eq(deliveries.assignmentId, assignmentId));

		return result?.value;
	}

	/**
	 * Returns the delivery with the id.
	 *
	 * @param id - The delivery id.
	 *
	 * @returns The delivery on success.
	 */
	static async getByParticipant({
		page = 1,
		count,
		participantId,
	}: Partial<{ page: number; count: number }> & { participantId: string }) {
		return db.query.deliveries.findMany({
			limit: count,
			offset: count ? (page - 1) * count : undefined,
			where: (deliveries, { eq }) =>
				eq(deliveries.participantId, participantId),
		});
	}
}
