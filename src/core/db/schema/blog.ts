import { relations } from "drizzle-orm"
import {
  index,
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
    summary: text("summary").notNull().default(""),
    contentMarkdown: text("content_markdown").notNull().default(""),
    publishedAt: timestamp("published_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    typeSlugUnique: unique("posts_type_slug_unique").on(table.type, table.slug),
    statusPublishedIdx: index("posts_status_published_idx").on(
      table.status,
      table.publishedAt,
    ),
    typeStatusPublishedIdx: index("posts_type_status_published_idx").on(
      table.type,
      table.status,
      table.publishedAt,
    ),
    authorIdx: index("posts_author_idx").on(table.authorId),
  }),
)

export const tags = pgTable("tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
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
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.tagId] }),
    tagIdx: index("post_tags_tag_idx").on(table.tagId),
  }),
)

export const booklogSeries = pgTable("booklog_series", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  coverImageUrl: text("cover_image_url"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
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
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
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
    seriesOrderIdx: index("booklog_series_entries_series_order_idx").on(
      table.seriesId,
      table.orderIndex,
    ),
    postIdx: index("booklog_series_entries_post_idx").on(table.postId),
  }),
)

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  postTags: many(postTags),
  seriesEntries: many(booklogSeriesEntries),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}))

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}))

export const booklogSeriesRelations = relations(booklogSeries, ({ many }) => ({
  entries: many(booklogSeriesEntries),
}))

export const booklogSeriesEntriesRelations = relations(
  booklogSeriesEntries,
  ({ one }) => ({
    series: one(booklogSeries, {
      fields: [booklogSeriesEntries.seriesId],
      references: [booklogSeries.id],
    }),
    post: one(posts, {
      fields: [booklogSeriesEntries.postId],
      references: [posts.id],
    }),
  }),
)
