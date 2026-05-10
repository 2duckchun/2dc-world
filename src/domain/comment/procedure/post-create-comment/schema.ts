import { z } from "zod"

export const commentBodySchema = z
  .string()
  .trim()
  .min(1, "내용을 입력하세요.")
  .max(1000, "최대 1000자까지 입력할 수 있습니다.")

export const commentCreateInputSchema = z.object({
  postId: z.string().min(1, "게시글 식별자가 필요합니다."),
  parentCommentId: z.string().min(1).nullable(),
  body: commentBodySchema,
})

export const commentCreateOutputSchema = z.object({
  id: z.string(),
})

export type CommentCreateInput = z.input<typeof commentCreateInputSchema>
export type CommentCreateOutput = z.output<typeof commentCreateOutputSchema>
