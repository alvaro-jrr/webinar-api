import { Context } from "hono";

import { AssignmentDao } from "@/database/dao/assignments";

import {
	insertAssignmentSchema,
	updateAssignmentSchema,
} from "@/schemas/assignments";

import { response } from "@/lib/utils";

export class AssignmentController {
	/**
	 * Creates an assignment.
	 *
	 * @param c - The route context.
	 */
	static async create(c: Context) {
		const parsed = insertAssignmentSchema.safeParse(await c.req.json());

		if (!parsed.success) {
			return response(c, {
				status: 422,
				message: parsed.error.message,
			});
		}

		const { data: body } = parsed;

		// Validate that the weighting to set doesn't surpass the asignments weighting total.
		const isValidWeighting = await AssignmentDao.isWeightingValid(
			body.weighting,
		);

		if (!isValidWeighting) {
			return response(c, {
				status: 400,
				message: "The weighting is not valid",
			});
		}

		const assignment = await AssignmentDao.create(body);

		if (!assignment) {
			return response(c, {
				status: 400,
				message: "Assignment not created",
			});
		}

		return response(c, {
			status: 201,
			data: assignment,
		});
	}

	/**
	 * Updates an assignment.
	 *
	 * @param c - The route context.
	 */
	static async update(c: Context) {
		const id = c.req.param("id");
		const exists = await AssignmentDao.exists(id);

		if (!exists) {
			return response(c, {
				status: 404,
				message: "Assignment not found",
			});
		}

		const parsed = updateAssignmentSchema.safeParse(await c.req.json());

		if (!parsed.success) {
			return response(c, {
				status: 422,
				message: parsed.error.message,
			});
		}

		const { data: body } = parsed;

		// Validate the weighting.
		if (body.weighting) {
			// Validate that the weighting to set doesn't surpass the asignments weighting total.
			const isValidWeighting = await AssignmentDao.isWeightingValid(
				body.weighting,
				id,
			);

			if (!isValidWeighting) {
				return response(c, {
					status: 400,
					message: "The weighting is not valid",
				});
			}
		}

		const assignment = await AssignmentDao.update({
			...body,
			id,
		});

		if (!assignment) {
			return response(c, {
				status: 400,
				message: "Assignment not updated",
			});
		}

		return response(c, {
			status: 200,
			data: assignment,
		});
	}

	/**
	 * Deletes an assignment.
	 *
	 * @param c - The route context.
	 */
	static async delete(c: Context) {
		const id = c.req.param("id");
		const exists = await AssignmentDao.exists(id);

		if (!exists) {
			return response(c, {
				status: 404,
				message: "Assignment not found",
			});
		}

		const deleted = await AssignmentDao.delete(id);

		if (!deleted) {
			return response(c, {
				status: 400,
				message: "Assignment not deleted",
			});
		}

		return response(c, {
			status: 200,
			data: null,
		});
	}

	/**
	 * Returns an assignment.
	 *
	 * @param c - The route context.
	 */
	static async getById(c: Context) {
		const id = c.req.param("id");
		const assignment = await AssignmentDao.getById(id);

		return response(c, {
			status: 200,
			data: assignment ?? null,
		});
	}

	/**
	 * Returns the assignments.
	 *
	 * @param c - The route context.
	 */
	static async getAll(c: Context) {
		const { page, count } = c.req.query();

		const assignments = await AssignmentDao.getAll({
			page: page ? parseInt(page) : undefined,
			count: count ? parseInt(count) : undefined,
		});

		return response(c, {
			status: 200,
			data: assignments,
		});
	}

	/**
	 * Returns the remaining weighting to evaluate.
	 *
	 * @param c - The route context.
	 */
	static async getRemainingWeighting(c: Context) {
		const remaining = await AssignmentDao.getWeightingRemainingToEvaluate();

		return response(c, {
			status: 200,
			data: remaining,
		});
	}
}
