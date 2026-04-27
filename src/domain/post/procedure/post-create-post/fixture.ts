import type { PostCreatePostInput, PostCreatePostOutput } from "./schema"

export const postCreatePostInputFixture = {
  title: "새 게시글",
  slug: "new-post",
  subtitle: null,
  thumbnail: null,
  content: "# 새 게시글",
  kind: "post",
  status: "draft",
  seriesId: null,
  seriesOrder: null,
  tags: [],
} satisfies PostCreatePostInput

export const postCreatePostOutputFixture = {
  id: "post_fixture_1",
  slug: "new-post",
} satisfies PostCreatePostOutput
