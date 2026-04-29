import type { PostListForAdminOutput } from "./schema"

export const postListForAdminFixture = [
  {
    id: "post_fixture_1",
    title: "첫 게시글",
    slug: "first-post",
    kind: "post",
    status: "draft",
    seriesOrder: null,
    publishedAt: null,
    updatedAt: new Date("2026-04-26T00:00:00.000Z"),
    series: null,
  },
] satisfies PostListForAdminOutput
