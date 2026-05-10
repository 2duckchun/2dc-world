import { z } from "zod"

export const likeGetPostStatsInputSchema = z.object({
  postId: z.string().min(1, "게시글 식별자가 필요합니다."),
})

export const likeGetPostStatsOutputSchema = z.object({
  likeCount: z.number().int().min(0),
  likedByMe: z.boolean(),
})

export type LikeGetPostStatsInput = z.input<typeof likeGetPostStatsInputSchema>
export type LikeGetPostStatsOutput = z.output<
  typeof likeGetPostStatsOutputSchema
>
