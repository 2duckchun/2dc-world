import { z } from "zod"
import { blogPostSummarySchema, blogPostTypeSchema } from "@/domain/blog/model"

export const getListPublishedInputSchema = z.object({
  type: blogPostTypeSchema,
  limit: z.number().int().min(1).max(48).default(18),
})

export const getListPublishedOutputSchema = z.array(blogPostSummarySchema)

export type GetListPublishedInput = z.infer<typeof getListPublishedInputSchema>
export type GetListPublishedOutput = z.infer<
  typeof getListPublishedOutputSchema
>
