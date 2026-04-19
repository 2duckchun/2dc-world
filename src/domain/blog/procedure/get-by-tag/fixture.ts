import type { GetByTagOutput } from "./schema"

export const getByTagFixture: NonNullable<GetByTagOutput> = {
  tagName: "reading",
  posts: [
    {
      id: "post_booklog_1",
      type: "BOOKLOG",
      slug: "slow-reading-week-1",
      title: "Slow reading, week 1",
      summary: "Week one notes and annotations.",
      publishedAt: "2026-04-19T00:00:00.000Z",
      readingMinutes: 3,
      tagNames: ["reading"],
      series: {
        slug: "slow-reading",
        title: "Slow reading",
        orderIndex: 1,
        chapterLabel: "Week 1",
      },
    },
  ],
}
