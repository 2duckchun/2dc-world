import type {
  LikeTogglePostLikeInput,
  LikeTogglePostLikeOutput,
} from "./schema"

export const likeTogglePostLikeInputFixture = {
  postId: "post_fixture_1",
} satisfies LikeTogglePostLikeInput

export const likeTogglePostLikeOutputFixture = {
  liked: true,
  likeCount: 1,
} satisfies LikeTogglePostLikeOutput
