import type { ContentGetSeriesArchiveOutput } from "./schema"

export const contentGetSeriesArchiveFixture = [
  {
    id: "series_fixture_1",
    title: "Example series",
    slug: "series-example",
    description: "Example series archive item.",
    thumbnail: null,
    createdAt: new Date("2026-04-26T00:00:00.000Z"),
    updatedAt: new Date("2026-04-26T00:00:00.000Z"),
    posts: [
      {
        id: "series_post_fixture_1",
        title: "First series post",
        slug: "series-first-post",
        subtitle: null,
        publishedAt: new Date("2026-04-26T00:00:00.000Z"),
        createdAt: new Date("2026-04-26T00:00:00.000Z"),
        seriesOrder: 1,
      },
    ],
  },
] satisfies ContentGetSeriesArchiveOutput
