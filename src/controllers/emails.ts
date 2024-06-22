import { Resend } from "resend";

import { env } from "@/lib/utils";

const resend = new Resend(env.RESEND_API_KEY);

type CreateEmailOptions = Parameters<typeof resend.emails.send>[0];

type Tag = NonNullable<CreateEmailOptions["tags"]>[number];

export class EmailController {
	/**
	 * Sends an email with the content.
	 */
	static async send({
		to,
		subject,
		tags = [],
		html,
	}: {
		to: string;
		subject: string;
		tags: Array<Tag>;
		html: string;
	}) {
		return resend.emails.send({
			from: "Webinar <noreply@resend.dev>",
			to,
			subject,
			tags,
			html,
		});
	}
}
