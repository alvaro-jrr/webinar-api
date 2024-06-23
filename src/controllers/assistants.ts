import { Context } from "hono";

import { AssistantDao } from "@/database/dao/assistants";

import {
	insertAssistantSchema,
	updateAssistantSchema,
} from "@/schemas/assistants";
import { assistantPayloadSchema } from "@/schemas/jwt";

import { JwtUtils } from "@/lib/jwt";
import { env, response } from "@/lib/utils";

import { EmailController } from "./emails";

export class AssistantController {
	/**
	 * Creates an assistnt.
	 *
	 * @param c - The route context.
	 */
	static async create(c: Context) {
		const parsed = insertAssistantSchema
			.omit({ isConfirmed: true })
			.safeParse(await c.req.json());

		if (!parsed.success) {
			return response(c, {
				status: 422,
				message: parsed.error.message,
			});
		}

		const { data: body } = parsed;

		const isEmailTaken = await AssistantDao.isEmailTaken(body.email);

		if (isEmailTaken) {
			return response(c, {
				status: 409,
				message: "Email is already taken",
			});
		}

		const assistant = await AssistantDao.create({
			...body,
			isConfirmed: false,
		});

		if (!assistant) {
			return response(c, {
				status: 400,
				message: "Assistant not created",
			});
		}

		const token = await JwtUtils.generate({
			data: {
				assistantId: assistant.id,
			},
			expireTime: {
				value: 4,
				unit: "hours",
			},
		});

		await EmailController.send({
			to: assistant.email,
			subject: "Completa tu Registro al Webinar",
			html: `<p>Hola, tu registro está casi formalizado. Por favor, accede a este enlace para <a href="${env.WEB_URL}/assistants/confirm?token=${token}">completar tu registro</a>. El enlace expirará en 8 horas.</p>`,
			tags: [
				{
					name: "category",
					value: "confirm_email",
				},
			],
		});

		return response(c, {
			status: 201,
			data: {
				...assistant,
				token,
			},
		});
	}

	/**
	 * Updates an assistant.
	 *
	 * @param c - The route context.
	 */
	static async update(c: Context) {
		const id = c.req.param("id");
		const exists = await AssistantDao.exists(id);

		if (!exists) {
			return response(c, {
				status: 404,
				message: "Assistant not found",
			});
		}

		const parsed = updateAssistantSchema.safeParse(await c.req.json());

		if (!parsed.success) {
			return response(c, {
				status: 422,
				message: parsed.error.message,
			});
		}

		const { data: body } = parsed;

		const assistant = await AssistantDao.update({
			...body,
			id,
		});

		if (!assistant) {
			return response(c, {
				status: 400,
				message: "Assistant not updated",
			});
		}

		return response(c, {
			status: 200,
			data: assistant,
		});
	}

	/**
	 * Confirms an assistant.
	 *
	 * @param c - The route context.
	 */
	static async confirmEmail(c: Context) {
		const payload = assistantPayloadSchema.safeParse(c.get("jwtPayload"));

		if (!payload || !payload.success) {
			return response(c, {
				status: 400,
				message: "Not valid",
			});
		}

		const assistant = await AssistantDao.update({
			id: payload.data.assistantId,
			isConfirmed: true,
		});

		if (!assistant) {
			return response(c, {
				status: 400,
				message: "Assistant not confirmed",
			});
		}

		return response(c, {
			status: 200,
			data: assistant,
		});
	}

	/**
	 * Deletes an assistant.
	 *
	 * @param c - The route context.
	 */
	static async delete(c: Context) {
		const id = c.req.param("id");
		const exists = await AssistantDao.exists(id);

		if (!exists) {
			return response(c, {
				status: 404,
				message: "Assistant not found",
			});
		}

		const deleted = await AssistantDao.delete(id);

		if (!deleted) {
			return response(c, {
				status: 400,
				message: "Assistant not deleted",
			});
		}

		return response(c, {
			status: 200,
			data: null,
		});
	}

	/**
	 * Returns an assistant.
	 *
	 * @param c - The route context.
	 */
	static async getById(c: Context) {
		const id = c.req.param("id");
		const assistant = await AssistantDao.getById(id);

		return response(c, {
			status: 200,
			data: assistant ?? null,
		});
	}

	/**
	 * Returns the assistants.
	 *
	 * @param c - The route context.
	 */
	static async getAll(c: Context) {
		const { page, count } = c.req.query();

		const assistants = await AssistantDao.getAll({
			page: page ? parseInt(page) : undefined,
			count: count ? parseInt(count) : undefined,
		});

		return response(c, {
			status: 200,
			data: assistants,
		});
	}
}
