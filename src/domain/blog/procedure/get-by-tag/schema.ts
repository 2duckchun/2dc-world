import { z } from "zod"
import { blogPostSummarySchema } from "@/domain/blog/model"

export const getByTagInputSchema = z.object({
  tagName: z.string().min(1),
})

export const getByTagOutputSchema = z
  .object({
    tagName: z.string().min(1),
    posts: z.array(blogPostSummarySchema),
  })
  .nullable()

export type GetByTagInput = z.infer<typeof getByTagInputSchema>
export type GetByTagOutput = z.infer<typeof getByTagOutputSchema>
