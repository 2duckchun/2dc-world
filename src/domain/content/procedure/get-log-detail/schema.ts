import { z } from "zod"

const logDetailSeriesSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
  })
  .nullable()

const logDetailSchema = z.object({
  title: z.string(),
  slug: z.string(),
  subtitle: z.string().nullable(),
  thumbnail: z.string().nullable(),
  content: z.string(),
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
  series: logDetailSeriesSchema,
})

export const contentGetLogDetailInputSchema = z.object({
  slug: z.string().min(1),
})

export const contentGetLogDetailOutputSchema = logDetailSchema.nullable()

export type ContentGetLogDetailInput = z.input<
  typeof contentGetLogDetailInputSchema
>

export type ContentGetLogDetailOutput = z.output<
  typeof contentGetLogDetailOutputSchema
>
