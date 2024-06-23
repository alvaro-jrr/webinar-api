import { Context } from "hono";

import { AssignmentDao } from "@/database/dao/assignments";
import { DeliveryDao } from "@/database/dao/deliveries";
import { ParticipantDao } from "@/database/dao/participants";

import {
	insertDeliverySchema,
	updateDeliverySchema,
	updateManyDeliveriesSchema,
} from "@/schemas/deliveries";

import { response } from "@/lib/utils";

export class DeliveryController {
	/**
	 * Creates a delivery.
	 *
	 * @param c - The route context.
	 */
	static async create(c: Context) {
		const parsed = insertDeliverySchema.safeParse(await c.req.json());

		if (!parsed.success) {
			return response(c, {
				status: 422,
				message: parsed.error.message,
			});
		}

		const { data: body } = parsed;

		// Wether the assignment exists.
		const existsAssignment = await AssignmentDao.exists(body.assignmentId);

		if (!existsAssignment) {
			return response(c, {
				status: 404,
				message: "Assignment not found",
			});
		}

		// Wether the participant exists.
		const existsParticipant = await ParticipantDao.exists(body.participantId);

		if (!existsParticipant) {
			return response(c, {
				status: 404,
				message: "Participant not found",
			});
		}

		const delivery = await DeliveryDao.create(body);

		if (!delivery) {
			return response(c, {
				status: 400,
				message: "Delivery not created",
			});
		}

		return response(c, {
			status: 201,
			data: delivery,
		});
	}

	/**
	 * Creates many deliveries.
	 *
	 * @param c - The route context.
	 */
	static async createMany(c: Context) {
		const parsed = insertDeliverySchema.array().safeParse(await c.req.json());

		if (!parsed.success) {
			return response(c, {
				status: 422,
				message: parsed.error.message,
			});
		}

		const { data: body } = parsed;

		const deliveries = await DeliveryDao.createMany(body);

		if (!deliveries) {
			return response(c, {
				status: 400,
				message: "Deliveries not created",
			});
		}

		return response(c, {
			status: 201,
			data: deliveries,
		});
	}

	/**
	 * Updates a delivery.
	 *
	 * @param c - The route context.
	 */
	static async update(c: Context) {
		const id = c.req.param("id");
		const exists = await DeliveryDao.exists(id);

		if (!exists) {
			return response(c, {
				status: 404,
				message: "Delivery not found",
			});
		}

		const parsed = updateDeliverySchema.safeParse(await c.req.json());

		if (!parsed.success) {
			return response(c, {
				status: 422,
				message: parsed.error.message,
			});
		}

		const { data: body } = parsed;

		const delivery = await DeliveryDao.update({
			...body,
			id,
		});

		if (!delivery) {
			return response(c, {
				status: 400,
				message: "Delivery not updated",
			});
		}

		return response(c, {
			status: 200,
			data: delivery,
		});
	}

	/**
	 * Updates many deliveries.
	 *
	 * @param c - The route context.
	 */
	static async updateMany(c: Context) {
		const parsed = updateManyDeliveriesSchema.safeParse(await c.req.json());

		if (!parsed.success) {
			return response(c, {
				status: 422,
				message: parsed.error.message,
			});
		}

		const { data: body } = parsed;

		const deliveries = await DeliveryDao.updateMany(body);

		return response(c, {
			status: 200,
			data: deliveries,
		});
	}

	/**
	 * Deletes a delivery.
	 *
	 * @param c - The route context.
	 */
	static async delete(c: Context) {
		const id = c.req.param("id");
		const exists = await DeliveryDao.exists(id);

		if (!exists) {
			return response(c, {
				status: 404,
				message: "Delivery not found",
			});
		}

		const deleted = await DeliveryDao.delete(id);

		if (!deleted) {
			return response(c, {
				status: 400,
				message: "Delivery not deleted",
			});
		}

		return response(c, {
			status: 200,
			data: null,
		});
	}

	/**
	 * Returns a delivery.
	 *
	 * @param c - The route context.
	 */
	static async getById(c: Context) {
		const id = c.req.param("id");
		const exists = await DeliveryDao.exists(id);

		if (!exists) {
			return response(c, {
				status: 404,
				message: "Delivery not found",
			});
		}

		const delivery = await DeliveryDao.getById(id);

		return response(c, {
			status: 200,
			data: delivery ?? null,
		});
	}

	/**
	 * Returns the deliveries.
	 *
	 * @param c - The route context.
	 */
	static async getAll(c: Context) {
		const { page, count } = c.req.query();

		const deliveries = await DeliveryDao.getAll({
			page: page ? parseInt(page) : undefined,
			count: count ? parseInt(count) : undefined,
		});

		return response(c, {
			status: 200,
			data: deliveries,
		});
	}
}
