import { z } from "zod"

export const likeTogglePostLikeInputSchema = z.object({
  postId: z.string().min(1, "게시글 식별자가 필요합니다."),
})

export const likeTogglePostLikeOutputSchema = z.object({
  liked: z.boolean(),
  likeCount: z.number().int().min(0),
})

export type LikeTogglePostLikeInput = z.input<
  typeof likeTogglePostLikeInputSchema
>
export type LikeTogglePostLikeOutput = z.output<
  typeof likeTogglePostLikeOutputSchema
>
