import { z } from "zod"
import { booklogSeriesDetailSchema } from "@/domain/blog/model"

export const getSeriesBySlugInputSchema = z.object({
  seriesSlug: z.string().min(1),
})

export const getSeriesBySlugOutputSchema = booklogSeriesDetailSchema.nullable()

export type GetSeriesBySlugInput = z.infer<typeof getSeriesBySlugInputSchema>
export type GetSeriesBySlugOutput = z.infer<typeof getSeriesBySlugOutputSchema>
