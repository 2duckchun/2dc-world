import { z } from "zod"

export const commentSoftDeleteInputSchema = z.object({
  commentId: z.string().min(1, "댓글 식별자가 필요합니다."),
})

export const commentSoftDeleteOutputSchema = z.object({
  id: z.string(),
})

export type CommentSoftDeleteInput = z.input<
  typeof commentSoftDeleteInputSchema
>
export type CommentSoftDeleteOutput = z.output<
  typeof commentSoftDeleteOutputSchema
>
