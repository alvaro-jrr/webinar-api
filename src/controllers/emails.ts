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
			html: `
				<head>
				  <link
				    href='https://fonts.googleapis.com/css?family=Inter'
				    rel='stylesheet'
				  >
				</head>
				<body style='background-color: white'>
				  <table style='
				    color: black;
				    max-width: 600px;
				    margin: 0 auto;
				    padding: 0;
				    border-collapse: collapse;
				    font-family:
				      "Inter",
				      "Helvetica",
				      "Arial",
				      sans-serif;
				  '
				    height='100%'
				    width='100%'
				  >
				    <tbody>
				      <tr>
					<td style='padding: 30px;' align='center' valign='top'>
					  <div>
					    <img
					      style='text-align: center;'
					      src='https://utfs.io/f/a6d4d414-e41e-462f-bf5f-bcb5fedf89df-2olo5d.png'
					      alt='Notificación de Tech Talent Hub'
					      width='48'
					    />
					    <h1 style='
					      font-size: 2.4em;
					      line-height: 1.3;
					    '
					    >Hola!</h1>
					    <p style='font-size: 1.6em; line-height: 1.3'>
					      Nuestra presentación tendrá lugar este 15 de Julio.
					    </p>
					    <p style='font-size: 1.6em; line-height: 1.3'>
					      Gracias por tu interés en formar parte.
					    </p>
					    <hr>
					    <p><strong>
					      <a
						href='https://meet.google.com/yse-jdti-oot'>Enlace de Google Meet
					      </a>
					    </strong></p>
					  </div>
					</td>
				      </tr>
				    </tbody>
				  </table>
				</body>
			      `,
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
				html: `
				  <head>
				    <link
				      href='https://fonts.googleapis.com/css?family=Inter'
				      rel='stylesheet'
				    >
				  </head>
				  <body style= 'background-color: white'>
				    <table style='
				      color: black;
				      max-width: 600px;
				      margin: 0 auto;
				      padding: 0;
				      border-collapse: collapse;
				      font-family:
					&quot;Inter&quot;,
					&quot;Helvetica&quot;,
					&quot;Arial&quot;,
					sans-serif;
				      '
				      height='100%'
				      width='100%'
				    >
				      <tbody>
					<tr>
					  <td style='padding: 30px;' align='center' valign='top'>
					    <div>
					      <img
						style='text-align: center;'
						src='https://utfs.io/f/a6d4d414-e41e-462f-bf5f-bcb5fedf89df-2olo5d.png'
						alt='Notificación de Tech Talent Hub'
						width='48'
					      >
					      <h1 style='
						font-size: 2.4em;
						line-height: 1.3;
						'
					      >Hola de nuevo!</h1>
					      <p style='font-size: 1.6em; line-height: 1.3'>
						El evento será el día de hoy, a partir de las 6:00PM.
					      </p>
					      <p style='font-size: 1.6em; line-height: 1.3'>
						No te lo pierdas!
					      </p>
					      <hr>
					      <p><strong>
						<a
						  href='https://meet.google.com/yse-jdti-oot'>Enlace de Google Meet
						</a>
					      </strong></p>
					    </div>
					  </td>
					</tr>
				      </tbody>
				    </table>
				  </body>
				`,
			});

			// There's no assistants left.
			if (count > emails.length) break;

			// Wait at least 1 second due to Resend constraints and update page.
			await delay(1500);
			page++;
		}
	}
}
