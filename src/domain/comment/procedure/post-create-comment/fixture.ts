import type { CommentCreateInput, CommentCreateOutput } from "./schema"

export const commentCreateInputFixture = {
  postId: "post_fixture_1",
  parentCommentId: null,
  body: "댓글 본문",
} satisfies CommentCreateInput

export const commentCreateOutputFixture = {
  id: "comment_fixture_new",
} satisfies CommentCreateOutput
