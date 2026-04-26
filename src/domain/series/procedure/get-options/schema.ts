import { z } from "zod"

export const seriesGetOptionsInputSchema = z.void()

export const seriesGetOptionsOutputSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
  }),
)

export type SeriesGetOptionsOutput = z.output<
  typeof seriesGetOptionsOutputSchema
>
