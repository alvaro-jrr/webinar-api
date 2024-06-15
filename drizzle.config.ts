import type { Config } from "drizzle-kit";

import { env } from "@/lib/utils";

export default {
	schema: "./src/database/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: env.DB_URL,
		authToken: env.DB_AUTH_TOKEN,
	},
} satisfies Config;
