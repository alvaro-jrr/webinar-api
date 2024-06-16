import type { InsertUser } from "@/schemas/users";

import { db } from "../client";
import { users } from "../schema";

export class UserDao {
	/**
	 * Creates an user.
	 *
	 * @param user - The user to insert.
	 *
	 * @returns The created user on success.
	 */
	static async create(user: InsertUser) {
		const [insertedUser] = await db.insert(users).values(user).returning();

		return insertedUser;
	}

	/**
	 * Wether the email is already taken.
	 *
	 * @param email - The email to validate.
	 * @returns
	 */
	static async isEmailTaken(email: string) {
		return db.query.users.findFirst({
			columns: {
				id: true,
			},
			where: (users, { eq }) => eq(users.email, email),
		});
	}

	/**
	 * Returns the user that matches with the email.
	 *
	 * @param email - The email to look up.
	 */
	static async getByEmail(email: string) {
		return db.query.users.findFirst({
			where: (users, { eq }) => eq(users.email, email),
		});
	}

	/**
	 * Returns the user with the id.
	 *
	 * @param id - The user id.
	 *
	 * @returns The user on success.
	 */
	static async getById(id: string) {
		return db.query.users.findFirst({
			columns: {
				password: false,
			},
			where: (users, { eq }) => eq(users.id, id),
		});
	}

	/**
	 * Wether an user with the id exists.
	 *
	 * @param id - The user id.
	 *
	 * @returns Boolean that indicates if an user has the id.
	 */
	static async exists(id: string) {
		const user = await db.query.users.findFirst({
			columns: {
				id: true,
			},
			where: (users, { eq }) => eq(users.id, id),
		});

		return Boolean(user);
	}
}
