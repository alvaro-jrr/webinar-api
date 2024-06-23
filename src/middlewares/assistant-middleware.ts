import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { jwt } from "hono/jwt";

import { AssistantDao } from "@/database/dao/assistants";

import { assistantPayloadSchema } from "@/schemas/jwt";

import { env } from "@/lib/utils";

export const assistantMiddleware = [
	jwt({ secret: env.JWT_SECRET }),
	createMiddleware(async (c, next) => {
		const payload = assistantPayloadSchema.safeParse(c.get("jwtPayload"));

		if (!payload || !payload.success) {
			throw new HTTPException(401, {
				message: "Token not found",
			});
		}

		const exists = await AssistantDao.exists(payload.data.assistantId);

		if (!exists) {
			throw new HTTPException(401, {
				message: "Assistant not found",
			});
		}

		await next();
	}),
];
