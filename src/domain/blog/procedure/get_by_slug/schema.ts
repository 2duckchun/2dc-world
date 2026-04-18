import { z } from "zod"
import {
  postTypeSchema,
  publishedPostDetailSchema,
} from "@/domain/blog/lib/contracts"

export const getBySlugInputSchema = z.object({
  type: postTypeSchema,
  slug: z.string().min(1),
})

export const getBySlugOutputSchema = publishedPostDetailSchema

export type GetBySlugInput = z.infer<typeof getBySlugInputSchema>
export type GetBySlugOutput = z.infer<typeof getBySlugOutputSchema>
