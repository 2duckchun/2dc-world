import type { GetSeriesBySlugOutput } from "./schema"

export const getSeriesBySlugFixture: NonNullable<GetSeriesBySlugOutput> = {
  slug: "slow-reading",
  title: "Slow reading",
  description: "A sequence of reading notes meant to be consumed in order.",
  coverImageUrl: null,
  postCount: 2,
  latestPublishedAt: "2026-04-26T00:00:00.000Z",
  posts: [
    {
      slug: "slow-reading-week-1",
      title: "Slow reading, week 1",
      summary: "Week one notes and annotations.",
      publishedAt: "2026-04-19T00:00:00.000Z",
      readingMinutes: 3,
      orderIndex: 1,
      chapterLabel: "Week 1",
      tagNames: ["reading"],
    },
  ],
}
