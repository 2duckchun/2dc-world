import { z } from "zod"

const postDetailSeriesSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
  })
  .nullable()

const postDetailSchema = z.object({
  title: z.string(),
  slug: z.string(),
  subtitle: z.string().nullable(),
  thumbnail: z.string().nullable(),
  content: z.string(),
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
  series: postDetailSeriesSchema,
})

export const contentGetPostDetailInputSchema = z.object({
  slug: z.string().min(1),
})

export const contentGetPostDetailOutputSchema = postDetailSchema.nullable()

export type ContentGetPostDetailInput = z.input<
  typeof contentGetPostDetailInputSchema
>

export type ContentGetPostDetailOutput = z.output<
  typeof contentGetPostDetailOutputSchema
>
