import { z } from "zod"
import { publishedSeriesSummarySchema } from "@/domain/blog/lib/contracts"

export const getSeriesListOutputSchema = z.array(publishedSeriesSummarySchema)

export type GetSeriesListOutput = z.infer<typeof getSeriesListOutputSchema>
