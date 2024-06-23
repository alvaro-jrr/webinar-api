import { Resend } from "resend";

import { AssistantDao } from "@/database/dao/assistants";

import { Constants } from "@/lib/constants";
import { delay, env } from "@/lib/utils";

const resend = new Resend(env.RESEND_API_KEY);

type CreateEmailOptions = Parameters<typeof resend.emails.send>[0];

type Tag = NonNullable<CreateEmailOptions["tags"]>[number];

export class EmailController {
	/**
	 * Sends an email with the content.
	 */
	static async send({
		from,
		to,
		subject,
		tags = [],
		html,
	}: {
		from?: string;
		to: string | Array<string>;
		subject: string;
		tags?: Array<Tag>;
		html: string;
	}) {
		return resend.emails.send({
			from: from ?? `${Constants.emailFromName} <noreply@resend.dev>`,
			to: typeof to === "string" ? to : to.slice(0, 50),
			subject,
			tags,
			html,
		});
	}

	/**
	 * Sends the email reminders for the event.
	 */
	static async sendEventReminder() {
		const currentDate = new Date();

		// The webinar is only on 2024.
		if (currentDate.getFullYear() !== 2024) return;

		let page = 1;
		const count = 50;

		while (true) {
			const emails = await AssistantDao.getAllNotifiableEmails({
				page,
				count,
			});

			// No assistants.
			if (!emails.length) break;

			// Send reminders.
			await this.send({
				to: emails,
				subject: "Recordatorio de Webinar",
				from: `${Constants.emailFromName} <notifications@resend.dev>`,
				html: "<p>Recuerda que este 15 de julio se realizará el Webinar sobre Tech Talent Hub, !no te lo pierdas! Te esperamos</p>",
			});

			// There's no assistants left.
			if (count > emails.length) break;

			// Wait at least 1 second due to Resend constraints and update page.
			await delay(1500);
			page++;
		}
	}
}
