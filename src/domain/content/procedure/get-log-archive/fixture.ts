import type { ContentGetLogArchiveOutput } from "./schema"

export const contentGetLogArchiveFixture = [
  {
    id: "log_fixture_1",
    title: "First log",
    slug: "first-log",
    subtitle: "Example log archive item.",
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
] satisfies ContentGetLogArchiveOutput
