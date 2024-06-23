import bcrypt from "bcryptjs";
import { Context } from "hono";

import { UserDao } from "@/database/dao/users";

import { insertUserSchema } from "@/schemas/users";

import { response } from "@/lib/utils";

export class UserController {
	/**
	 * Creates an user.
	 *
	 * @param c - The route context.
	 */
	static async create(c: Context) {
		const parsed = insertUserSchema.safeParse(await c.req.json());

		if (!parsed.success) {
			return response(c, {
				status: 422,
				message: parsed.error.message,
			});
		}

		const { data: body } = parsed;

		// Wether the email is already taken by another user.
		const isEmailTaken = await UserDao.isEmailTaken(body.email);

		if (isEmailTaken) {
			return response(c, {
				status: 409,
				message: "Email already taken",
			});
		}

		const insertedUser = await UserDao.create({
			...body,
			// Encrypt the password.
			password: await bcrypt.hash(body.password, 10),
		});

		if (!insertedUser) {
			return response(c, {
				status: 400,
				message: "User not created",
			});
		}

		return response(c, {
			status: 201,
			data: insertedUser,
		});
	}
}
