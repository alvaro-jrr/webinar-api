import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { Context } from "hono";

import { UserDao } from "@/database/dao/users";

import { userCredentialsSchema } from "@/schemas/users";

import { JwtUtils } from "@/lib/jwt";
import { response } from "@/lib/utils";

export class AuthController {
	/**
	 * Login an user.
	 *
	 * @param c - The route context.
	 */
	static async login(c: Context) {
		const parsed = userCredentialsSchema.safeParse(await c.req.json());

		if (!parsed.success) {
			return response(c, {
				status: 422,
				message: parsed.error.message,
			});
		}

		const { data: body } = parsed;

		// The user.
		const user = await UserDao.getByEmail(body.email);

		const passwordMatches =
			user && (await bcrypt.compare(body.password, user.password));

		if (!passwordMatches) {
			return response(c, {
				status: 401,
				message: "Invalid credentials",
			});
		}

		// Set the JWT token.
		const token = await JwtUtils.set(c, user.id);
		const { password, ...restOfUser } = user;

		console.log("GET", JwtUtils.get(c));

		return response(c, {
			status: 200,
			data: {
				...restOfUser,
				token,
			},
		});
	}

	/**
	 * Checks wheter an user is logged in.
	 *
	 * @param c - The route context.
	 */
	static async checkStatus(c: Context) {
		const payload = JwtUtils.get(c);
		const isExpired = !payload || dayjs().unix() > payload.exp;

		if (isExpired) {
			return response(c, {
				status: 401,
				message: "Invalid token",
			});
		}

		const user = await UserDao.getById(payload.userId);

		if (!user) {
			return response(c, {
				status: 404,
				message: "User not found",
			});
		}

		return response(c, { status: 200, data: user });
	}
}
