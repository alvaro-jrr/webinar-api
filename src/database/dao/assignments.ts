import { InsertAssignment } from "@/schemas/assignments";

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
}
