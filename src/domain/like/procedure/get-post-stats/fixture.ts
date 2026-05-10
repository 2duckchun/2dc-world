import type { LikeGetPostStatsInput, LikeGetPostStatsOutput } from "./schema"

export const likeGetPostStatsInputFixture = {
  postId: "post_fixture_1",
} satisfies LikeGetPostStatsInput

export const likeGetPostStatsOutputFixture = {
  likeCount: 0,
  likedByMe: false,
} satisfies LikeGetPostStatsOutput
