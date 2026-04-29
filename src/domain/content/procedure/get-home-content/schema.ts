import { z } from "zod"
import { postKindValues } from "@/domain/content/types"

const homeContentTagSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
})

const homeContentSeriesLinkSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
  })
  .nullable()

const homeContentPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  subtitle: z.string().nullable(),
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
  kind: z.enum(postKindValues),
  series: homeContentSeriesLinkSchema,
  postTags: z.array(
    z.object({
      tag: homeContentTagSchema,
    }),
  ),
})

const homeContentSeriesPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  subtitle: z.string().nullable(),
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
  seriesOrder: z.number().int().nullable(),
})

const homeContentSeriesSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  thumbnail: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  posts: z.array(homeContentSeriesPostSchema),
})

export const contentGetHomeContentInputSchema = z.void()

export const contentGetHomeContentOutputSchema = z.object({
  posts: z.array(homeContentPostSchema),
  series: z.array(homeContentSeriesSchema),
})

export type ContentGetHomeContentOutput = z.output<
  typeof contentGetHomeContentOutputSchema
>
