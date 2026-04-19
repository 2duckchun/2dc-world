import type { GetListPublishedOutput } from "./schema"

export const getListPublishedFixture: GetListPublishedOutput = [
  {
    id: "post_blog_1",
    type: "BLOG",
    slug: "phase-1-public-reading",
    title: "Phase 1 public reading is ready",
    summary:
      "A calm walkthrough of the published reading surface for 2dc world.",
    publishedAt: "2026-04-19T00:00:00.000Z",
    readingMinutes: 4,
    tagNames: ["nextjs", "drizzle"],
    series: null,
  },
]
