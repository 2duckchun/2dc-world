import { z } from "zod"
import { blogPostDetailSchema, blogPostTypeSchema } from "@/domain/blog/model"

export const getBySlugInputSchema = z.object({
  type: blogPostTypeSchema,
  slug: z.string().min(1),
})

export const getBySlugOutputSchema = blogPostDetailSchema.nullable()

export type GetBySlugInput = z.infer<typeof getBySlugInputSchema>
export type GetBySlugOutput = z.infer<typeof getBySlugOutputSchema>
