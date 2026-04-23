CREATE TYPE "public"."post_kind" AS ENUM('post', 'log', 'series');--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "kind" "post_kind" DEFAULT 'post' NOT NULL;