import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "@/lib/utils";

import * as schema from "./schema";

export const client = createClient({
	url: env.DB_URL,
	authToken: env.DB_AUTH_TOKEN,
});

export const db = drizzle(client, {
	schema,
});
