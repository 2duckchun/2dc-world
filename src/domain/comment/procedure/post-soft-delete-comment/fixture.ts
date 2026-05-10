import type { CommentSoftDeleteInput, CommentSoftDeleteOutput } from "./schema"

export const commentSoftDeleteInputFixture = {
  commentId: "comment_fixture_1",
} satisfies CommentSoftDeleteInput

export const commentSoftDeleteOutputFixture = {
  id: "comment_fixture_1",
} satisfies CommentSoftDeleteOutput
