CREATE TABLE `calendarEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int,
	`title` varchar(180) NOT NULL,
	`eventType` varchar(60) NOT NULL,
	`startsAt` bigint NOT NULL,
	`status` enum('planned','in_progress','done') NOT NULL DEFAULT 'planned',
	CONSTRAINT `calendarEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int,
	`name` varchar(180) NOT NULL,
	`kind` varchar(60) NOT NULL,
	`url` text,
	`createdAt` bigint NOT NULL,
	CONSTRAINT `files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int,
	`subject` varchar(180) NOT NULL,
	`channel` varchar(40) NOT NULL,
	`status` enum('open','waiting','closed') NOT NULL DEFAULT 'open',
	`createdAt` bigint NOT NULL,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspaceSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceName` varchar(160) NOT NULL,
	`defaultCurrency` varchar(8) NOT NULL DEFAULT 'INR',
	`approvalSlaHours` int NOT NULL DEFAULT 48,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `workspaceSettings_id` PRIMARY KEY(`id`)
);
