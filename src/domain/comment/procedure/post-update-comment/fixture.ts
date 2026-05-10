import type { CommentUpdateInput, CommentUpdateOutput } from "./schema"

export const commentUpdateInputFixture = {
  commentId: "comment_fixture_1",
  body: "수정된 댓글",
} satisfies CommentUpdateInput

export const commentUpdateOutputFixture = {
  id: "comment_fixture_1",
} satisfies CommentUpdateOutput
