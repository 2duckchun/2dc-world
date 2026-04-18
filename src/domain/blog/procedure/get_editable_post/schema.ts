import { z } from "zod"
import { editablePostSchema, postTypeSchema } from "@/domain/blog/lib/contracts"

export const getEditablePostInputSchema = z.object({
  type: postTypeSchema,
  slug: z.string().min(1),
})

export const getEditablePostOutputSchema = editablePostSchema

export type GetEditablePostInput = z.infer<typeof getEditablePostInputSchema>
export type GetEditablePostOutput = z.infer<typeof getEditablePostOutputSchema>
