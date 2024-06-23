import { z } from "zod";

export const envSchema = z.object({
	/** The database remote URL or local file */
	DB_URL: z.union([z.string().regex(/^file:/), z.string().url()]),
	/** The auth token to make valid requests on remote database  */
	DB_AUTH_TOKEN: z.string().default(""),
	/** The JWT Secret */
	JWT_SECRET: z.string().min(1),
	/** The Resend API Key */
	RESEND_API_KEY: z.string().min(1),
	/** The Web URL */
	WEB_URL: z.string().url(),
});
