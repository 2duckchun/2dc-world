import type { ContentGetPostArchiveOutput } from "./schema"

export const contentGetPostArchiveFixture = [
  {
    id: "post_fixture_1",
    title: "First post",
    slug: "first-post",
    subtitle: "Example post archive item.",
    publishedAt: new Date("2026-04-26T00:00:00.000Z"),
    createdAt: new Date("2026-04-26T00:00:00.000Z"),
    postTags: [
      {
        tag: {
          id: "tag_fixture_1",
          name: "Example tag",
          slug: "tag-example",
        },
      },
    ],
  },
] satisfies ContentGetPostArchiveOutput
