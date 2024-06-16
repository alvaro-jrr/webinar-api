import dayjs from "dayjs";
import { Context } from "hono";
import { sign } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

import { jwtPayloadSchema } from "@/schemas/jwt";

import { env } from "./utils";

export const JwtUtils = {
	/**
	 * Sets the JWT payload for the user and returns the token.
	 *
	 * @param context - The app context.
	 * @param userId - The user id to save.
	 * @returns The JWT token.
	 */
	set: (context: Context, userId: string) => {
		const now = dayjs();
		const payload = {
			iat: now.unix(),
			nbf: now.unix(),
			exp: now.add(1, "day").unix(), // Expires in 1 day.
			userId,
		} satisfies JWTPayload;

		context.set("jwtPayload", payload);
		return sign(payload, env.JWT_SECRET);
	},
	/**
	 * Returns the JWT payload.
	 *
	 * @param context - The app context.
	 * @returns The JWT payload.
	 */
	get: (context: Context) => {
		const payload = jwtPayloadSchema.safeParse(context.get("jwtPayload"));

		return payload.success ? payload.data : null;
	},
	/**
	 * Clears the JWT payload.
	 *
	 * @param context - The app context.
	 */
	clear: (context: Context) => {
		context.set("jwtPayload", null);
	},
};
