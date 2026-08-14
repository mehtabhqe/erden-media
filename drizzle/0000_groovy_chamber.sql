CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`name` varchar(180) NOT NULL,
	`type` varchar(80) NOT NULL,
	`status` enum('draft','live','complete') NOT NULL DEFAULT 'draft',
	`progress` int NOT NULL DEFAULT 0,
	`startDate` bigint,
	`endDate` bigint,
	`createdAt` bigint NOT NULL,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`category` varchar(80) NOT NULL,
	`leadInitials` varchar(8) NOT NULL,
	`status` enum('on_track','needs_review','awaiting_assets') NOT NULL DEFAULT 'on_track',
	`health` int NOT NULL DEFAULT 50,
	`email` varchar(320),
	`website` varchar(320),
	`notes` text,
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contentItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`campaignId` int,
	`title` varchar(180) NOT NULL,
	`channel` varchar(60) NOT NULL,
	`status` enum('draft','awaiting_approval','approved','published') NOT NULL DEFAULT 'draft',
	`dueDate` bigint,
	`createdAt` bigint NOT NULL,
	CONSTRAINT `contentItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `influencers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`handle` varchar(120) NOT NULL,
	`platform` varchar(60) NOT NULL,
	`audience` int NOT NULL DEFAULT 0,
	`status` enum('prospect','contacted','confirmed','complete') NOT NULL DEFAULT 'prospect',
	CONSTRAINT `influencers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`number` varchar(40) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(8) NOT NULL DEFAULT 'INR',
	`status` enum('draft','open','paid','overdue') NOT NULL DEFAULT 'open',
	`dueAt` bigint,
	`createdAt` bigint NOT NULL,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_number_unique` UNIQUE(`number`)
);
--> statement-breakpoint
CREATE TABLE `mediaContacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`outlet` varchar(160) NOT NULL,
	`beat` varchar(100),
	`status` enum('not_contacted','contacted','responded','covered') NOT NULL DEFAULT 'not_contacted',
	`lastContactedAt` bigint,
	CONSTRAINT `mediaContacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`period` varchar(80) NOT NULL,
	`status` enum('draft','ready','sent') NOT NULL DEFAULT 'draft',
	`createdAt` bigint NOT NULL,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int,
	`title` varchar(180) NOT NULL,
	`assignee` varchar(120),
	`dueAt` bigint,
	`status` enum('todo','in_progress','done') NOT NULL DEFAULT 'todo',
	`createdAt` bigint NOT NULL,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
