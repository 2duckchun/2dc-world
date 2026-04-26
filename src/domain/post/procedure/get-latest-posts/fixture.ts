import type { GetLatestPostsOutput } from "./schema"

export const getLatestPostsFixture = [
  {
    id: "post_fixture_1",
    title: "첫 게시글",
    slug: "first-post",
    subtitle: "게시글 목록 응답 예시입니다.",
    thumbnail: null,
    kind: "post",
    publishedAt: new Date("2026-04-26T00:00:00.000Z"),
    createdAt: new Date("2026-04-26T00:00:00.000Z"),
  },
] satisfies GetLatestPostsOutput
