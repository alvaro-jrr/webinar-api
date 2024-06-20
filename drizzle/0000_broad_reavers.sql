CREATE TABLE `assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(100) NOT NULL,
	`weighting` real NOT NULL,
	`date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `assistants` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text(50) NOT NULL,
	`full_name` text(50) NOT NULL,
	`company` text(50),
	`position` text(50),
	`interests` text,
	`is_confirmed` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `deliveries` (
	`id` text PRIMARY KEY NOT NULL,
	`participant_id` text(50) NOT NULL,
	`assignment_id` text(50) NOT NULL,
	`score` real NOT NULL,
	`url` text,
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `participants` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text(50) NOT NULL,
	`role` text(50) NOT NULL,
	`cv_url` text NOT NULL,
	`photo_url` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text(50) NOT NULL,
	`full_name` text(50) NOT NULL,
	`password` text(70) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `assistants_email_unique` ON `assistants` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `deliveries_assignment_id_participant_id_unique` ON `deliveries` (`assignment_id`,`participant_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `participants_cv_url_unique` ON `participants` (`cv_url`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);