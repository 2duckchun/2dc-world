import { z } from "zod"

export const seriesListInputSchema = z.void()

export const seriesListOutputSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    thumbnail: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    episodeCount: z.number().int().nonnegative(),
  }),
)

export type SeriesListOutput = z.output<typeof seriesListOutputSchema>
