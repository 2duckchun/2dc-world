import { z } from "zod"

export const blogPostTypes = ["BLOG", "MEMO", "BOOKLOG"] as const
export const blogPostStatuses = ["DRAFT", "PUBLISHED"] as const

export const blogPostTypeSchema = z.enum(blogPostTypes)
export const blogPostStatusSchema = z.enum(blogPostStatuses)

export type BlogPostType = z.infer<typeof blogPostTypeSchema>
export type BlogPostStatus = z.infer<typeof blogPostStatusSchema>

const publicPostTypeMap = {
  blog: "BLOG",
  memo: "MEMO",
  booklog: "BOOKLOG",
} as const satisfies Record<string, BlogPostType>

export type PublicPostTypeSegment = keyof typeof publicPostTypeMap

export const blogPostTypeMeta = {
  BLOG: {
    label: "Blog",
    shortLabel: "BLOG",
    segment: "blog",
    description: "Long-form essays, experiments, and polished notes.",
    eyebrow: "Deep reads",
  },
  MEMO: {
    label: "Memo",
    shortLabel: "MEMO",
    segment: "memo",
    description: "Short, dense updates designed for scanning and recall.",
    eyebrow: "Quick notes",
  },
  BOOKLOG: {
    label: "Booklog",
    shortLabel: "BOOKLOG",
    segment: "booklog",
    description: "Reading logs with ordered series and chapter-aware context.",
    eyebrow: "Reading flow",
  },
} as const satisfies Record<
  BlogPostType,
  {
    label: string
    shortLabel: string
    segment: PublicPostTypeSegment
    description: string
    eyebrow: string
  }
>

export function isBlogPostType(value: string): value is BlogPostType {
  return blogPostTypes.includes(value as BlogPostType)
}

export function parsePublicPostTypeSegment(
  segment: string,
): BlogPostType | null {
  return publicPostTypeMap[segment as PublicPostTypeSegment] ?? null
}

export function getPublicPostTypeSegment(
  type: BlogPostType,
): PublicPostTypeSegment {
  return blogPostTypeMeta[type].segment
}

export function getPostRoute(type: BlogPostType, slug: string) {
  return `/${getPublicPostTypeSegment(type)}/${slug}`
}

export function getTagRoute(tagName: string) {
  return `/tags/${encodeURIComponent(tagName)}`
}

export function getBooklogSeriesRoute(seriesSlug: string) {
  return `/booklog/series/${seriesSlug}`
}

export const blogSeriesPreviewPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  orderIndex: z.number().int().positive(),
  chapterLabel: z.string().nullable(),
})

export const blogSeriesMembershipSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  orderIndex: z.number().int().positive(),
  chapterLabel: z.string().nullable(),
})

export const blogPostSummarySchema = z.object({
  id: z.string().min(1),
  type: blogPostTypeSchema,
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string(),
  publishedAt: z.string().min(1),
  readingMinutes: z.number().int().positive(),
  tagNames: z.array(z.string().min(1)),
  series: blogSeriesMembershipSchema.nullable(),
})

export const blogPostNavigationItemSchema = z.object({
  type: blogPostTypeSchema,
  slug: z.string().min(1),
  title: z.string().min(1),
  publishedAt: z.string().min(1),
  orderIndex: z.number().int().positive().nullable(),
  chapterLabel: z.string().nullable(),
})

export const blogPostSeriesContextSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  orderIndex: z.number().int().positive(),
  chapterLabel: z.string().nullable(),
  totalPosts: z.number().int().positive(),
  previousPost: blogPostNavigationItemSchema.nullable(),
  nextPost: blogPostNavigationItemSchema.nullable(),
})

export const blogPostDetailSchema = z.object({
  id: z.string().min(1),
  type: blogPostTypeSchema,
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string(),
  contentMarkdown: z.string(),
  publishedAt: z.string().min(1),
  updatedAt: z.string().min(1),
  readingMinutes: z.number().int().positive(),
  tagNames: z.array(z.string().min(1)),
  series: blogPostSeriesContextSchema.nullable(),
  navigationMode: z.enum(["chronological", "series"]),
  previousPost: blogPostNavigationItemSchema.nullable(),
  nextPost: blogPostNavigationItemSchema.nullable(),
})

export const booklogSeriesSummarySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  coverImageUrl: z.string().nullable(),
  postCount: z.number().int().nonnegative(),
  latestPublishedAt: z.string().nullable(),
  previewPosts: z.array(blogSeriesPreviewPostSchema),
})

export const booklogSeriesDetailEntrySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string(),
  publishedAt: z.string().min(1),
  readingMinutes: z.number().int().positive(),
  orderIndex: z.number().int().positive(),
  chapterLabel: z.string().nullable(),
  tagNames: z.array(z.string().min(1)),
})

export const booklogSeriesDetailSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  coverImageUrl: z.string().nullable(),
  postCount: z.number().int().nonnegative(),
  latestPublishedAt: z.string().nullable(),
  posts: z.array(booklogSeriesDetailEntrySchema),
})

export type BlogPostSummary = z.infer<typeof blogPostSummarySchema>
export type BlogPostNavigationItem = z.infer<
  typeof blogPostNavigationItemSchema
>
export type BlogPostDetail = z.infer<typeof blogPostDetailSchema>
export type BlogPostSeriesContext = z.infer<typeof blogPostSeriesContextSchema>
export type BooklogSeriesSummary = z.infer<typeof booklogSeriesSummarySchema>
export type BooklogSeriesDetail = z.infer<typeof booklogSeriesDetailSchema>
export type BooklogSeriesDetailEntry = z.infer<
  typeof booklogSeriesDetailEntrySchema
>
