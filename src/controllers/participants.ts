import { Context } from "hono";

import { AssignmentDao } from "@/database/dao/assignments";
import { DeliveryDao } from "@/database/dao/deliveries";
import { ParticipantDao } from "@/database/dao/participants";

import {
	insertParticipantSchema,
	updateParticipantSchema,
} from "@/schemas/participants";

import { Constants } from "@/lib/constants";
import { response } from "@/lib/utils";

export class ParticipantController {
	/**
	 * Creates a participant.
	 *
	 * @param c - The route context.
	 */
	static async create(c: Context) {
		const parsed = insertParticipantSchema.safeParse(await c.req.json());

		if (!parsed.success) {
			return response(c, {
				status: 422,
				message: parsed.error.message,
			});
		}

		const { data: body } = parsed;

		const participant = await ParticipantDao.create({
			...body,
			photoUrl: body.photoUrl ?? Constants.defaultPhotoUrl,
		});

		if (!participant) {
			return response(c, {
				status: 400,
				message: "Participant not created",
			});
		}

		return response(c, {
			status: 201,
			data: participant,
		});
	}

	/**
	 * Updates a participant.
	 *
	 * @param c - The route context.
	 */
	static async update(c: Context) {
		const id = c.req.param("id");
		const exists = await ParticipantDao.exists(id);

		if (!exists) {
			return response(c, {
				status: 404,
				message: "Participant not found",
			});
		}

		const parsed = updateParticipantSchema.safeParse(await c.req.json());

		if (!parsed.success) {
			return response(c, {
				status: 422,
				message: parsed.error.message,
			});
		}

		const { data: body } = parsed;

		const participant = await ParticipantDao.update({
			...body,
			id,
		});

		if (!participant) {
			return response(c, {
				status: 400,
				message: "Participant not updated",
			});
		}

		return response(c, {
			status: 200,
			data: participant,
		});
	}

	/**
	 * Deletes a participant.
	 *
	 * @param c - The route context.
	 */
	static async delete(c: Context) {
		const id = c.req.param("id");
		const exists = await ParticipantDao.exists(id);

		if (!exists) {
			return response(c, {
				status: 404,
				message: "Participant not found",
			});
		}

		const deleted = await ParticipantDao.delete(id);

		if (!deleted) {
			return response(c, {
				status: 400,
				message: "Participant not deleted",
			});
		}

		return response(c, {
			status: 200,
			data: null,
		});
	}

	/**
	 * Returns a participant.
	 *
	 * @param c - The route context.
	 */
	static async getById(c: Context) {
		const id = c.req.param("id");

		// Wether should retrieve the assignments of the participant.
		const shouldGetAssignments = c.req.query("assignments") === "true";

		const participant = await ParticipantDao.getById(id, {
			assignments: shouldGetAssignments,
		});

		return response(c, {
			status: 200,
			data: participant ?? null,
		});
	}

	/**
	 * Returns the participant deliveries.
	 *
	 * @param c - The route context.
	 */
	static async getDeliveries(c: Context) {
		const id = c.req.param("id");

		const deliveries = await DeliveryDao.getByParticipant({
			participantId: id,
		});

		return response(c, {
			status: 200,
			data: deliveries,
		});
	}

	/**
	 * Returns the participant deliveries.
	 *
	 * @param c - The route context.
	 */
	static async getAssignmentsDelivery(c: Context) {
		const id = c.req.param("id");

		const exists = await ParticipantDao.exists(id);

		if (!exists) {
			return response(c, {
				status: 200,
				data: [],
			});
		}

		/// Gets the assignments.
		const assignments =
			await AssignmentDao.getParticipantAssignmentsDelivery(id);

		return response(c, {
			status: 200,
			data: assignments,
		});
	}

	/**
	 * Returns the participants.
	 *
	 * @param c - The route context.
	 */
	static async getAll(c: Context) {
		const { page, count } = c.req.query();

		const participants = await ParticipantDao.getAll({
			page: page ? parseInt(page) : undefined,
			count: count ? parseInt(count) : undefined,
		});

		return response(c, {
			status: 200,
			data: participants,
		});
	}
}
