import "dotenv/config";

import { envSchema } from "@/schemas/env";

/**
 * The `.env` variables.
 */
export const env = envSchema.parse(process.env);
