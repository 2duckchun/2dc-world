import type { GetBySlugOutput } from "./schema"

export const getBySlugFixture: NonNullable<GetBySlugOutput> = {
  id: "post_booklog_1",
  type: "BOOKLOG",
  slug: "slow-reading-week-1",
  title: "Slow reading, week 1",
  summary:
    "A reading log entry with series-aware navigation and markdown content.",
  contentMarkdown: "# Slow reading\n\nThis entry tracks a careful first week.",
  publishedAt: "2026-04-19T00:00:00.000Z",
  updatedAt: "2026-04-19T00:00:00.000Z",
  readingMinutes: 3,
  tagNames: ["reading", "notes"],
  series: {
    slug: "slow-reading",
    title: "Slow reading",
    description: "A paced walk through a longer text.",
    orderIndex: 1,
    chapterLabel: "Week 1",
    totalPosts: 3,
    previousPost: null,
    nextPost: {
      type: "BOOKLOG",
      slug: "slow-reading-week-2",
      title: "Slow reading, week 2",
      publishedAt: "2026-04-26T00:00:00.000Z",
      orderIndex: 2,
      chapterLabel: "Week 2",
    },
  },
  navigationMode: "series",
  previousPost: null,
  nextPost: {
    type: "BOOKLOG",
    slug: "slow-reading-week-2",
    title: "Slow reading, week 2",
    publishedAt: "2026-04-26T00:00:00.000Z",
    orderIndex: 2,
    chapterLabel: "Week 2",
  },
}
