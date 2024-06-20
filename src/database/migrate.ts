import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";

import { db, client } from "./client";
import assignmentsJson from "./migrations/assignments.json";
import { assignments } from "./schema";

// This will run migrations on the database, skipping the ones already applied.
await migrate(db, { migrationsFolder: "./drizzle" });

await db.insert(assignments).values(assignmentsJson);

// Don't forget to close the connection, otherwise the script will hang.
client.close();
