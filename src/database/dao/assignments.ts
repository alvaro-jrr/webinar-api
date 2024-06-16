import { eq, sum } from "drizzle-orm";

import { InsertAssignment, UpdateAssignment } from "@/schemas/assignments";

import { db } from "../client";
import { assignments } from "../schema";

export class AssignmentDao {
	/**
	 * Creates an assignment.
	 *
	 * @param assignment - The assignment to insert.
	 *
	 * @returns The created assignment on success.
	 */
	static async create(assignment: InsertAssignment) {
		const [insertedAssignment] = await db
			.insert(assignments)
			.values(assignment)
			.returning();

		return insertedAssignment;
	}

	/**
	 * Updates an assignment.
	 *
	 * @param assignment - The assignment to update.
	 *
	 * @returns The updated assignment on success.
	 */
	static async update(assignment: UpdateAssignment) {
		const [result] = await db
			.update(assignments)
			.set(assignment)
			.where(eq(assignments.id, assignment.id))
			.returning();

		return result;
	}

	/**
	 * Deletes an assignment.
	 *
	 * @param assignment - The assignment to delete.
	 *
	 * @returns Wether the assignment was deleted.
	 */
	static async delete(assignmentId: string) {
		const [result] = await db
			.delete(assignments)
			.where(eq(assignments.id, assignmentId))
			.returning();

		return Boolean(result);
	}

	/**
	 * Returns the assignments.
	 *
	 * @param params - The query params.
	 *
	 * @returns The assignments.
	 */
	static async getAll({
		page = 1,
		count,
	}: Partial<{ page: number; count: number }>) {
		return db.query.assignments.findMany({
			limit: count,
			offset: count ? (page - 1) * count : undefined,
			orderBy: (assignments, { asc }) => asc(assignments.title),
		});
	}

	/**
	 * Returns the assignment with the id.
	 *
	 * @param id - The assignment id.
	 *
	 * @returns The assignment on success.
	 */
	static async getById(id: string) {
		return db.query.assignments.findFirst({
			where: (assignments, { eq }) => eq(assignments.id, id),
		});
	}

	/**
	 * Returns the weighting left to evaluate.
	 *
	 * @returns The amount of weighting that its left to evaluate.
	 */
	static async getWeightingRemainingToEvaluate() {
		const [amount] = await db
			.select({ value: sum(assignments.weighting) })
			.from(assignments);

		return amount?.value ? 100 - Number(amount.value) : 100;
	}

	/**
	 * Wether the score for the assignment is valid.
	 *
	 * @param params - The assignment id and the score to set.
	 *
	 * @returns A boolean that indicates if the score is valid.
	 */
	static async isScoreValid({ id, score }: { id: string; score: number }) {
		const assignment = await this.getById(id);
		if (!assignment) return false;

		return score >= 0 && score <= assignment.weighting;
	}

	/**
	 * Wether the weighting to set is valid.
	 *
	 * @param weighting - The weighting to set.
	 * @param id - The assignment id to update.
	 *
	 * @returns A boolean that indicates if the weighting is valid.
	 */
	static async isWeightingValid(weighting: number, id?: string) {
		const remaining = await this.getWeightingRemainingToEvaluate();

		const assignmentWeighting = id
			? (await this.getById(id))?.weighting ?? 0
			: 0;

		return weighting > 0 && weighting <= remaining + assignmentWeighting;
	}

	/**
	 * Wether the assignment with the id exists.
	 *
	 * @param id - The assignment id.
	 *
	 * @returns Returns a boolean.
	 */
	static async exists(id: string) {
		const assignment = await db.query.assignments.findFirst({
			columns: {
				id: true,
			},
			where: (assignments, { eq }) => eq(assignments.id, id),
		});

		return Boolean(assignment);
	}
}
