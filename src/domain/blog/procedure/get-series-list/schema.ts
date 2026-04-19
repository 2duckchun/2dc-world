import { z } from "zod"
import { booklogSeriesSummarySchema } from "@/domain/blog/model"

export const getSeriesListInputSchema = z.object({
  limit: z.number().int().min(1).max(24).default(6),
})

export const getSeriesListOutputSchema = z.array(booklogSeriesSummarySchema)

export type GetSeriesListInput = z.infer<typeof getSeriesListInputSchema>
export type GetSeriesListOutput = z.infer<typeof getSeriesListOutputSchema>
