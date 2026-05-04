import { z } from "zod"

const seriesPostDetailSeriesSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
  })
  .nullable()

const seriesPostDetailSchema = z.object({
  title: z.string(),
  slug: z.string(),
  subtitle: z.string().nullable(),
  thumbnail: z.string().nullable(),
  content: z.string(),
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
  series: seriesPostDetailSeriesSchema,
})

export const contentGetSeriesPostDetailInputSchema = z.object({
  seriesSlug: z.string().min(1),
  slug: z.string().min(1),
})

export const contentGetSeriesPostDetailOutputSchema =
  seriesPostDetailSchema.nullable()

export type ContentGetSeriesPostDetailInput = z.input<
  typeof contentGetSeriesPostDetailInputSchema
>

export type ContentGetSeriesPostDetailOutput = z.output<
  typeof contentGetSeriesPostDetailOutputSchema
>
