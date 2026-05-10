import type { CommentGetListInput, CommentGetListOutput } from "./schema"

export const commentGetListInputFixture = {
  postId: "post_fixture_1",
} satisfies CommentGetListInput

export const commentGetListOutputFixture = [
  {
    id: "comment_fixture_1",
    body: "첫 댓글입니다.",
    isDeleted: false,
    isEdited: false,
    createdAt: new Date("2026-05-10T00:00:00Z"),
    author: {
      id: "user_fixture_1",
      name: "Alice",
      image: null,
    },
    canEdit: false,
    canDelete: false,
    replies: [
      {
        id: "comment_fixture_2",
        body: "대댓글입니다.",
        isDeleted: false,
        isEdited: false,
        createdAt: new Date("2026-05-10T00:01:00Z"),
        author: {
          id: "user_fixture_2",
          name: "Bob",
          image: null,
        },
        canEdit: false,
        canDelete: false,
      },
    ],
  },
] satisfies CommentGetListOutput
