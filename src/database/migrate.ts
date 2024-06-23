import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";

import { DEFAULT_PHOTO_URL } from "@/lib/constants";

import { db, client } from "./client";
import assignmentsJson from "./migrations/assignments.json";
import participantsJson from "./migrations/participants.json";
import usersJson from "./migrations/users.json";
import { assignments, participants, users } from "./schema";

// This will run migrations on the database, skipping the ones already applied.
await migrate(db, { migrationsFolder: "./drizzle" });

await db.insert(assignments).values(assignmentsJson);

await db.insert(participants).values(
	participantsJson.map((value) => {
		return {
			...value,
			photoUrl: value.photoUrl ?? DEFAULT_PHOTO_URL,
		};
	}),
);

await db.insert(users).values(usersJson);

// Don't forget to close the connection, otherwise the script will hang.
client.close();
