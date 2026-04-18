import { z } from "zod"
import { authoringSeriesSchema } from "@/domain/blog/lib/contracts"

export const postCreateSeriesInputSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1).nullable().optional(),
  description: z.string().trim().min(1).nullable().optional(),
  coverImageUrl: z.string().trim().url().nullable().optional(),
})

export const postCreateSeriesOutputSchema = authoringSeriesSchema

export type PostCreateSeriesInput = z.infer<typeof postCreateSeriesInputSchema>
export type PostCreateSeriesOutput = z.infer<
  typeof postCreateSeriesOutputSchema
>
