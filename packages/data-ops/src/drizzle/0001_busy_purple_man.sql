CREATE TYPE "public"."difficulty" AS ENUM('facile', 'moyen', 'difficile');--> statement-breakpoint
CREATE TYPE "public"."exam_format" AS ENUM('écrit', 'pratique', 'oral');--> statement-breakpoint
CREATE TYPE "public"."grade" AS ENUM('3ème', 'Terminale');--> statement-breakpoint
CREATE TYPE "public"."series" AS ENUM('A', 'C', 'D', 'E', 'G');--> statement-breakpoint
CREATE TABLE "auth_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "auth_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "auth_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "auth_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"estimated_hours" numeric(4, 1) DEFAULT 1,
	"difficulty" "difficulty" DEFAULT 'moyen' NOT NULL,
	"objectives" text[],
	"prerequisites" text[],
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcard_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"flashcard_id" integer NOT NULL,
	"quality" integer NOT NULL,
	"response_time" integer NOT NULL,
	"previous_interval" integer,
	"previous_ease_factor" numeric(4, 2),
	"previous_repetitions" integer,
	"new_interval" integer,
	"new_ease_factor" numeric(4, 2),
	"new_repetitions" integer,
	"next_review_date" timestamp,
	"was_shown" boolean DEFAULT true NOT NULL,
	"was_skipped" boolean DEFAULT false NOT NULL,
	"responded_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcard_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"chapter_id" integer,
	"session_type" text DEFAULT 'review' NOT NULL,
	"max_cards" integer,
	"time_limit" integer,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"paused_at" timestamp,
	"total_paused_time" integer DEFAULT 0 NOT NULL,
	"total_cards" integer DEFAULT 0 NOT NULL,
	"new_cards" integer DEFAULT 0 NOT NULL,
	"learning_cards" integer DEFAULT 0 NOT NULL,
	"review_cards" integer DEFAULT 0 NOT NULL,
	"again_count" integer DEFAULT 0 NOT NULL,
	"hard_count" integer DEFAULT 0 NOT NULL,
	"good_count" integer DEFAULT 0 NOT NULL,
	"easy_count" integer DEFAULT 0 NOT NULL,
	"average_response_time" integer,
	"accuracy_rate" numeric(5, 2),
	"status" text DEFAULT 'active' NOT NULL,
	"current_card_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcards" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapter_id" integer NOT NULL,
	"front" text NOT NULL,
	"back" text NOT NULL,
	"example" text,
	"image_url" text,
	"audio_url" text,
	"tags" text[],
	"difficulty" numeric(3, 2) DEFAULT 0.5,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"grade" "grade" NOT NULL,
	"series" text[],
	"coefficient" integer NOT NULL,
	"exam_duration" integer NOT NULL,
	"exam_format" "exam_format" DEFAULT 'écrit' NOT NULL,
	"is_core" boolean DEFAULT false NOT NULL,
	"language_choice" boolean DEFAULT false NOT NULL,
	"mutual_exclusive_with" integer,
	"description" text,
	"color" text DEFAULT '#3B82F6',
	"icon" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_flashcard_progress" (
	"user_id" text NOT NULL,
	"flashcard_id" integer NOT NULL,
	"ease_factor" numeric(4, 2) DEFAULT 2.5 NOT NULL,
	"interval" integer DEFAULT 1 NOT NULL,
	"repetitions" integer DEFAULT 0 NOT NULL,
	"next_review_date" timestamp DEFAULT now() NOT NULL,
	"last_reviewed" timestamp,
	"total_reviews" integer DEFAULT 0 NOT NULL,
	"correct_reviews" integer DEFAULT 0 NOT NULL,
	"average_response_time" integer,
	"again_count" integer DEFAULT 0 NOT NULL,
	"hard_count" integer DEFAULT 0 NOT NULL,
	"good_count" integer DEFAULT 0 NOT NULL,
	"easy_count" integer DEFAULT 0 NOT NULL,
	"is_suspended" boolean DEFAULT false NOT NULL,
	"is_buried" boolean DEFAULT false NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_flashcard_progress_pkey" PRIMARY KEY("user_id","flashcard_id")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"grade" "grade" NOT NULL,
	"series" "series",
	"second_language" text,
	"school" text,
	"region" text,
	"exam_date" text,
	"study_goal" text,
	"daily_study_time" integer DEFAULT 60,
	"preferred_study_time" text,
	"study_streak" integer DEFAULT 0,
	"last_study_date" text,
	"total_xp" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"current_xp" integer DEFAULT 0,
	"onboarding_complete" boolean DEFAULT false NOT NULL,
	"notifications_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"user_id" text NOT NULL,
	"chapter_id" integer NOT NULL,
	"mastery_percentage" numeric(5, 2) DEFAULT 0 NOT NULL,
	"confidence_level" numeric(3, 2) DEFAULT 0.5 NOT NULL,
	"is_started" boolean DEFAULT false NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"last_studied" timestamp,
	"time_spent_minutes" integer DEFAULT 0 NOT NULL,
	"study_sessions" integer DEFAULT 0 NOT NULL,
	"flashcard_progress" numeric(5, 2) DEFAULT 0 NOT NULL,
	"quiz_progress" numeric(5, 2) DEFAULT 0 NOT NULL,
	"practice_progress" numeric(5, 2) DEFAULT 0 NOT NULL,
	"average_quiz_score" numeric(5, 2),
	"best_quiz_score" numeric(5, 2),
	"flashcard_retention_rate" numeric(5, 2),
	"next_review_date" timestamp,
	"total_reviews" integer DEFAULT 0 NOT NULL,
	"correct_reviews" integer DEFAULT 0 NOT NULL,
	"target_mastery" numeric(5, 2) DEFAULT 80 NOT NULL,
	"target_completion_date" timestamp,
	"current_difficulty" text DEFAULT 'moyen' NOT NULL,
	"adaptive_difficulty" boolean DEFAULT true NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"last_study_date" text,
	"quality_score" numeric(5, 2) DEFAULT 0 NOT NULL,
	"engagement_score" numeric(5, 2) DEFAULT 0 NOT NULL,
	"personal_notes" text,
	"difficult_concepts" text[],
	"mastered_concepts" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_progress_pkey" PRIMARY KEY("user_id","chapter_id")
);
--> statement-breakpoint
ALTER TABLE "auth_account" ADD CONSTRAINT "auth_account_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcard_responses" ADD CONSTRAINT "flashcard_responses_session_id_flashcard_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."flashcard_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcard_responses" ADD CONSTRAINT "flashcard_responses_flashcard_id_flashcards_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "public"."flashcards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcard_sessions" ADD CONSTRAINT "flashcard_sessions_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcard_sessions" ADD CONSTRAINT "flashcard_sessions_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_flashcard_progress" ADD CONSTRAINT "user_flashcard_progress_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_flashcard_progress" ADD CONSTRAINT "user_flashcard_progress_flashcard_id_flashcards_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "public"."flashcards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chapters_subject_id_idx" ON "chapters" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "chapters_subject_order_idx" ON "chapters" USING btree ("subject_id","order");--> statement-breakpoint
CREATE INDEX "flashcard_responses_session_idx" ON "flashcard_responses" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "flashcard_responses_flashcard_idx" ON "flashcard_responses" USING btree ("flashcard_id");--> statement-breakpoint
CREATE INDEX "flashcard_responses_quality_idx" ON "flashcard_responses" USING btree ("quality");--> statement-breakpoint
CREATE INDEX "flashcard_sessions_user_idx" ON "flashcard_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "flashcard_sessions_chapter_idx" ON "flashcard_sessions" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX "flashcard_sessions_status_idx" ON "flashcard_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "flashcards_chapter_id_idx" ON "flashcards" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX "flashcards_difficulty_idx" ON "flashcards" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "flashcards_active_idx" ON "flashcards" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "subjects_grade_idx" ON "subjects" USING btree ("grade");--> statement-breakpoint
CREATE INDEX "subjects_short_name_idx" ON "subjects" USING btree ("short_name");--> statement-breakpoint
CREATE INDEX "user_flashcard_next_review_idx" ON "user_flashcard_progress" USING btree ("user_id","next_review_date");--> statement-breakpoint
CREATE INDEX "user_profiles_grade_idx" ON "user_profiles" USING btree ("grade");--> statement-breakpoint
CREATE INDEX "user_profiles_series_idx" ON "user_profiles" USING btree ("series");--> statement-breakpoint
CREATE INDEX "user_profiles_streak_idx" ON "user_profiles" USING btree ("study_streak");--> statement-breakpoint
CREATE INDEX "user_profiles_xp_idx" ON "user_profiles" USING btree ("total_xp");--> statement-breakpoint
CREATE INDEX "user_progress_user_idx" ON "user_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_progress_chapter_idx" ON "user_progress" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX "user_progress_mastery_idx" ON "user_progress" USING btree ("mastery_percentage");--> statement-breakpoint
CREATE INDEX "user_progress_completed_idx" ON "user_progress" USING btree ("is_completed");