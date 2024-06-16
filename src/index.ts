import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";

import { response } from "./lib/utils";
import { authRouter } from "./routes/auth";
import { usersRouter } from "./routes/users";

const app = new Hono({ strict: false });

// Middlewares.
app.use(cors());
app.use(logger());

// Routes.
app.route("/auth", authRouter);
app.route("/users", usersRouter);

// Handle errors.
app.onError((err, c) => {
	return response(c, {
		status: err instanceof HTTPException ? err.status : 400,
		message: err.message,
	});
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});
