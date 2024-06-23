import "dotenv/config";
import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

import { envSchema } from "@/schemas/env";

/**
 * The `.env` variables.
 */
export const env = envSchema.parse(process.env);

/**
 * Returns a response in the desired format.
 */
export function response(
	context: Context,
	{
		status,
		message,
		data,
	}: {
		status: StatusCode;
		message?: string;
		data?: unknown;
	},
) {
	return context.json(
		{
			status,
			message,
			data,
		},
		status,
	);
}

/**
 * Delays a function execution.
 *
 * @param milliseconds - The number of milliseconds to delay.
 *
 * @returns A promise that is resolved in the time of milliseconds set.
 */
export function delay(milliseconds: number) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
