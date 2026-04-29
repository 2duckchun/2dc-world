import type { PostGetForEditOutput } from "./schema"

export const postGetForEditFixture = {
  id: "post_fixture_1",
  title: "첫 게시글",
  slug: "first-post",
  subtitle: "게시글 수정 응답 예시입니다.",
  thumbnail: null,
  content: "# 첫 게시글",
  kind: "post",
  status: "draft",
  seriesId: null,
  seriesOrder: null,
  tags: ["React"],
  publishedAt: null,
  createdAt: new Date("2026-04-26T00:00:00.000Z"),
  updatedAt: new Date("2026-04-26T00:00:00.000Z"),
} satisfies NonNullable<PostGetForEditOutput>
