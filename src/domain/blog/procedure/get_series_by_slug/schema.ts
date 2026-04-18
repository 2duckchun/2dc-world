import { z } from "zod"
import { publishedSeriesDetailSchema } from "@/domain/blog/lib/contracts"

export const getSeriesBySlugInputSchema = z.object({
  seriesSlug: z.string().min(1),
})

export const getSeriesBySlugOutputSchema = publishedSeriesDetailSchema

export type GetSeriesBySlugInput = z.infer<typeof getSeriesBySlugInputSchema>
export type GetSeriesBySlugOutput = z.infer<typeof getSeriesBySlugOutputSchema>
