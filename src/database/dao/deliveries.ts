import { eq } from "drizzle-orm";

import {
	Delivery,
	InsertDelivery,
	UpdateDelivery,
	UpdateManyDeliveries,
} from "@/schemas/deliveries";

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
	 * Creates many deliveries.
	 *
	 * @param deliveriesList - The deliveries to insert.
	 *
	 * @returns The created deliveries on success.
	 */
	static async createMany(deliveriesList: InsertDelivery[]) {
		return db.insert(deliveries).values(deliveriesList).returning();
	}

	/**
	 * Updates a delivery.
	 *
	 * @param delivery - The delivery to update.
	 *
	 * @returns The updated delivery on success.
	 */
	static async update(delivery: UpdateDelivery) {
		const [result] = await db
			.update(deliveries)
			.set(delivery)
			.where(eq(deliveries.id, delivery.id))
			.returning();

		return result;
	}

	/**
	 * Updates many deliveries.
	 *
	 * @param deliveriesList - The delivery to update.
	 *
	 * @returns The updated delivery on success.
	 */
	static async updateMany(deliveriesList: UpdateManyDeliveries) {
		const updatedList: Delivery[] = [];

		for (const delivery of deliveriesList) {
			const [updated] = await db
				.update(deliveries)
				.set(delivery)
				.where(eq(deliveries.id, delivery.id))
				.returning();

			if (updated) updatedList.push(updated);
		}

		return updatedList;
	}

	/**
	 * Deletes a delivery.
	 *
	 * @param deliveryId - The delivery to delete.
	 *
	 * @returns Wether the participant was deleted.
	 */
	static async delete(deliveryId: string) {
		const [result] = await db
			.delete(deliveries)
			.where(eq(deliveries.id, deliveryId))
			.returning();

		return Boolean(result);
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

	/**
	 * Wether a delivery with the id exists.
	 *
	 * @param id - The delivery id.
	 *
	 * @returns Boolean that indicates if a delivery has the id.
	 */
	static async exists(id: string) {
		const delivery = await db.query.deliveries.findFirst({
			columns: {
				id: true,
			},
			where: (deliveries, { eq }) => eq(deliveries.id, id),
		});

		return Boolean(delivery);
	}
}
