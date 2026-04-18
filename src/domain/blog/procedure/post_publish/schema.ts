import { z } from "zod"
import { editablePostSchema } from "@/domain/blog/lib/contracts"

export const postPublishInputSchema = z.object({
  postId: z.string().min(1),
})

export const postPublishOutputSchema = editablePostSchema

export type PostPublishInput = z.infer<typeof postPublishInputSchema>
export type PostPublishOutput = z.infer<typeof postPublishOutputSchema>
