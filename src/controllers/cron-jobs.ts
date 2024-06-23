import cron from "node-cron";

import { EmailController } from "./emails";

export const cronJobs = () => {
	// Email reminders.
	cron.schedule(
		"0 12 5,10,15 July *",
		() => {
			EmailController.sendEventReminder();
		},
		{
			scheduled: true,
			timezone: "America/Caracas",
		},
	);
};
