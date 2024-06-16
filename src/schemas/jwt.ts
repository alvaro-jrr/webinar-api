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
