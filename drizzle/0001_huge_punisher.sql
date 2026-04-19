CREATE TYPE "public"."post_status" AS ENUM('DRAFT', 'PUBLISHED');--> statement-breakpoint
CREATE TYPE "public"."post_type" AS ENUM('BLOG', 'MEMO', 'BOOKLOG');--> statement-breakpoint
CREATE TABLE "booklog_series" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"cover_image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "booklog_series_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "booklog_series_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"series_id" text NOT NULL,
	"post_id" text NOT NULL,
	"order_index" integer NOT NULL,
	"chapter_label" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "booklog_series_entries_series_post_unique" UNIQUE("series_id","post_id"),
	CONSTRAINT "booklog_series_entries_series_order_unique" UNIQUE("series_id","order_index")
);
--> statement-breakpoint
CREATE TABLE "post_tags" (
	"post_id" text NOT NULL,
	"tag_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_tags_post_id_tag_id_pk" PRIMARY KEY("post_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "post_type" NOT NULL,
	"status" "post_status" DEFAULT 'DRAFT' NOT NULL,
	"author_id" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"content_markdown" text DEFAULT '' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_type_slug_unique" UNIQUE("type","slug")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "booklog_series_entries" ADD CONSTRAINT "booklog_series_entries_series_id_booklog_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."booklog_series"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booklog_series_entries" ADD CONSTRAINT "booklog_series_entries_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "booklog_series_entries_series_order_idx" ON "booklog_series_entries" USING btree ("series_id","order_index");--> statement-breakpoint
CREATE INDEX "booklog_series_entries_post_idx" ON "booklog_series_entries" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_tags_tag_idx" ON "post_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "posts_status_published_idx" ON "posts" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "posts_type_status_published_idx" ON "posts" USING btree ("type","status","published_at");--> statement-breakpoint
CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");