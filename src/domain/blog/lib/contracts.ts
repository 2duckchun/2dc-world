import { z } from "zod"

export const postTypeSchema = z.enum(["BLOG", "MEMO", "BOOKLOG"])

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

export type PublishedPostSummary = z.infer<typeof publishedPostSummarySchema>
export type PublishedPostDetail = z.infer<typeof publishedPostDetailSchema>
export type PublishedSeriesSummary = z.infer<
  typeof publishedSeriesSummarySchema
>
export type PublishedSeriesDetail = z.infer<typeof publishedSeriesDetailSchema>
export type TagResults = z.infer<typeof tagResultsSchema>
