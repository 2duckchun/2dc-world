import type { inferRouterOutputs } from "@trpc/server"
import { z } from "zod"
import type { AppRouter } from "@/core/trpc/router"

const seriesArchivePostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  subtitle: z.string().nullable(),
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
  seriesOrder: z.number().int().nullable(),
})

const seriesArchiveSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  thumbnail: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  posts: z.array(seriesArchivePostSchema),
})

export const contentGetSeriesArchiveInputSchema = z.void()

export const contentGetSeriesArchiveOutputSchema = z.array(seriesArchiveSchema)

export type ContentGetSeriesArchiveOutput = z.output<
  typeof contentGetSeriesArchiveOutputSchema
>

export type SeriesArchiveData =
  inferRouterOutputs<AppRouter>["content"]["getSeriesArchive"]
