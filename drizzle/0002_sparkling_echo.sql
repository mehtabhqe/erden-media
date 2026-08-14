CREATE TABLE `publicInquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(160),
	`service` varchar(120) NOT NULL,
	`message` text NOT NULL,
	`source` varchar(60) NOT NULL DEFAULT 'contact',
	`status` enum('new','in_progress','closed') NOT NULL DEFAULT 'new',
	`createdAt` bigint NOT NULL,
	CONSTRAINT `publicInquiries_id` PRIMARY KEY(`id`)
);
