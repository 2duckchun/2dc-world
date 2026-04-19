import type { GetSeriesListOutput } from "./schema"

export const getSeriesListFixture: GetSeriesListOutput = [
  {
    slug: "slow-reading",
    title: "Slow reading",
    description: "A sequence of reading notes meant to be consumed in order.",
    coverImageUrl: null,
    postCount: 3,
    latestPublishedAt: "2026-04-26T00:00:00.000Z",
    previewPosts: [
      {
        slug: "slow-reading-week-1",
        title: "Slow reading, week 1",
        orderIndex: 1,
        chapterLabel: "Week 1",
      },
    ],
  },
]
