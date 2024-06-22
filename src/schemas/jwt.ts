import { z } from "zod";

/**
 * The schema of the JWT payload.
 */
export const jwtPayloadSchema = z.object({
	iat: z.number(),
	nbf: z.number(),
	exp: z.number(),
	userId: z.string(),
});

/**
 * The schema of the JWT payload for an assistant.
 */
export const assistantPayloadSchema = z.object({
	iat: z.number(),
	nbf: z.number(),
	exp: z.number(),
	assistantId: z.string(),
});
