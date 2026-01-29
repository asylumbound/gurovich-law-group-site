CREATE TABLE `discovery_drafts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`intake_id` int NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`type` varchar(50) NOT NULL,
	`title` varchar(500),
	`content` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `discovery_drafts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `discovery_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`intake_id` int NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`status` enum('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`due_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `discovery_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intake_access` (
	`id` int AUTO_INCREMENT NOT NULL,
	`intake_id` int NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`access_level` varchar(20) DEFAULT 'read',
	`granted_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `intake_access_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `terminal_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` varchar(36) NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`citations` json,
	`suggested_actions` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `terminal_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `terminal_sessions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`intake_id` int NOT NULL,
	`title` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `terminal_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `upload_text` (
	`id` int AUTO_INCREMENT NOT NULL,
	`intake_id` int NOT NULL,
	`upload_id` int NOT NULL,
	`file_name` varchar(500),
	`extracted_text` text,
	`word_count` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `upload_text_id` PRIMARY KEY(`id`)
);
