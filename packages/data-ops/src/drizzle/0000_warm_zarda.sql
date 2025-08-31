-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `subscriptions` (
	`user_id` text NOT NULL,
	`status` text NOT NULL,
	`current_period_start` numeric,
	`current_period_end` numeric,
	`cancel_at_period_end` numeric,
	`started_at` numeric,
	`product_id` text NOT NULL
);

*/