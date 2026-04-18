import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core"
import { users } from "./auth"

export const postTypeEnum = pgEnum("post_type", ["BLOG", "MEMO", "BOOKLOG"])
export const postStatusEnum = pgEnum("post_status", ["DRAFT", "PUBLISHED"])

export const posts = pgTable(
  "posts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    type: postTypeEnum("type").notNull(),
    status: postStatusEnum("status").notNull().default("DRAFT"),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    summary: text("summary"),
    contentMarkdown: text("content_markdown").notNull().default(""),
    publishedAt: timestamp("published_at", {
      withTimezone: true,
      mode: "date",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    typeSlugUnique: unique("posts_type_slug_unique").on(table.type, table.slug),
  }),
)

export const tags = pgTable("tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
})

export const postTags = pgTable(
  "post_tags",
  {
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.tagId] }),
  }),
)

export const booklogSeries = pgTable("booklog_series", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
})

export const booklogSeriesEntries = pgTable(
  "booklog_series_entries",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    seriesId: text("series_id")
      .notNull()
      .references(() => booklogSeries.id, { onDelete: "cascade" }),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    orderIndex: integer("order_index").notNull(),
    chapterLabel: text("chapter_label"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    seriesPostUnique: unique("booklog_series_entries_series_post_unique").on(
      table.seriesId,
      table.postId,
    ),
    seriesOrderUnique: unique("booklog_series_entries_series_order_unique").on(
      table.seriesId,
      table.orderIndex,
    ),
  }),
)
