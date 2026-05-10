import { z } from "zod"
import { commentBodySchema } from "../post-create-comment/schema"

export const commentUpdateInputSchema = z.object({
  commentId: z.string().min(1, "댓글 식별자가 필요합니다."),
  body: commentBodySchema,
})

export const commentUpdateOutputSchema = z.object({
  id: z.string(),
})

export type CommentUpdateInput = z.input<typeof commentUpdateInputSchema>
export type CommentUpdateOutput = z.output<typeof commentUpdateOutputSchema>
