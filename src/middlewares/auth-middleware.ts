import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { jwt } from "hono/jwt";

import { UserDao } from "@/database/dao/users";

import { JwtUtils } from "@/lib/jwt";
import { env } from "@/lib/utils";

export const authMiddleware = [
	jwt({ secret: env.JWT_SECRET }),
	createMiddleware(async (c, next) => {
		const payload = JwtUtils.get(c);

		if (!payload) {
			throw new HTTPException(401, {
				message: "Token not found",
			});
		}

		const exists = await UserDao.exists(payload.userId);

		if (!exists) {
			throw new HTTPException(401, {
				message: "User not found",
			});
		}

		await next();
	}),
];
