import { z } from "zod"

export const postTypeSchema = z.enum(["BLOG", "MEMO", "BOOKLOG"])
export const postStatusSchema = z.enum(["DRAFT", "PUBLISHED"])

export const publishedTagSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const publishedSeriesLinkSchema = z.object({
  slug: z.string(),
  title: z.string(),
  coverImageUrl: z.string().nullable(),
  href: z.string(),
  orderIndex: z.number().int().nullable(),
  chapterLabel: z.string().nullable(),
})

export const publishedPostSummarySchema = z.object({
  id: z.string(),
  type: postTypeSchema,
  slug: z.string(),
  title: z.string(),
  summary: z.string().nullable(),
  href: z.string(),
  publishedAt: z.string().nullable(),
  updatedAt: z.string(),
  tags: z.array(publishedTagSchema),
  series: publishedSeriesLinkSchema.nullable(),
})

export const publishedPostDetailSchema = publishedPostSummarySchema.extend({
  contentMarkdown: z.string(),
})

export const publishedSeriesSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  coverImageUrl: z.string().nullable(),
  href: z.string(),
  postCount: z.number().int().nonnegative(),
  updatedAt: z.string(),
})

export const publishedSeriesDetailSchema = publishedSeriesSummarySchema.extend({
  items: z.array(publishedPostSummarySchema),
})

export const tagResultsSchema = z.object({
  tagName: z.string(),
  items: z.array(publishedPostSummarySchema),
})

export const editableSeriesSelectionSchema = z.object({
  seriesId: z.string(),
  title: z.string(),
  slug: z.string(),
  coverImageUrl: z.string().nullable(),
  orderIndex: z.number().int(),
  chapterLabel: z.string().nullable(),
})

export const editablePostSchema = z.object({
  id: z.string(),
  type: postTypeSchema,
  status: postStatusSchema,
  title: z.string(),
  slug: z.string(),
  summary: z.string().nullable(),
  contentMarkdown: z.string(),
  publishedAt: z.string().nullable(),
  updatedAt: z.string(),
  tagNames: z.array(z.string()),
  series: editableSeriesSelectionSchema.nullable(),
})

export const draftListItemSchema = z.object({
  id: z.string(),
  type: postTypeSchema,
  status: postStatusSchema,
  title: z.string(),
  slug: z.string(),
  summary: z.string().nullable(),
  updatedAt: z.string(),
  publishedAt: z.string().nullable(),
})

export const authoringSeriesSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  coverImageUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const syncTagsResultSchema = z.object({
  postId: z.string(),
  tagNames: z.array(z.string()),
})

export type PublishedPostSummary = z.infer<typeof publishedPostSummarySchema>
export type PublishedPostDetail = z.infer<typeof publishedPostDetailSchema>
export type PublishedSeriesSummary = z.infer<
  typeof publishedSeriesSummarySchema
>
export type PublishedSeriesDetail = z.infer<typeof publishedSeriesDetailSchema>
export type TagResults = z.infer<typeof tagResultsSchema>
export type EditablePost = z.infer<typeof editablePostSchema>
export type DraftListItem = z.infer<typeof draftListItemSchema>
export type AuthoringSeries = z.infer<typeof authoringSeriesSchema>
export type SyncTagsResult = z.infer<typeof syncTagsResultSchema>
