import type { PostUpdatePostInput, PostUpdatePostOutput } from "./schema"

export const postUpdatePostInputFixture = {
  id: "post_fixture_1",
  title: "첫 게시글 수정",
  slug: "first-post",
  subtitle: "수정된 게시글 예시입니다.",
  thumbnail: null,
  content: "# 첫 게시글 수정",
  kind: "post",
  status: "published",
  seriesId: null,
  seriesOrder: null,
  tags: ["React"],
} satisfies PostUpdatePostInput

export const postUpdatePostOutputFixture = {
  id: "post_fixture_1",
  slug: "first-post",
} satisfies PostUpdatePostOutput
