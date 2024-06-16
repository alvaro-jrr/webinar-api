import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";

import { response } from "./lib/utils";
import { assignmentsRouter } from "./routes/assignments";
import { authRouter } from "./routes/auth";
import { deliveriesRouter } from "./routes/deliveries";
import { participantsRouter } from "./routes/participants";
import { usersRouter } from "./routes/users";

const app = new Hono({ strict: false });

// Middlewares.
app.use(cors());
app.use(logger());

// Routes.
app.route("/auth", authRouter);
app.route("/users", usersRouter);
app.route("/participants", participantsRouter);
app.route("/assignments", assignmentsRouter);
app.route("/deliveries", deliveriesRouter);

// Handle errors.
app.onError((err, c) => {
	return response(c, {
		status: err instanceof HTTPException ? err.status : 400,
		message: err.message,
	});
});

const port = 3000;
console.log(`Server is running on port ${port}`);
showRoutes(app);

serve({
	fetch: app.fetch,
	port,
});
