import type { ContentGetSeriesPostDetailOutput } from "./schema"

export const contentGetSeriesPostDetailFixture = {
  title: "First series post",
  slug: "series-first-post",
  subtitle: "Example series post detail item.",
  thumbnail: null,
  content: "# First series post\n\nExample markdown content.",
  publishedAt: new Date("2026-04-26T00:00:00.000Z"),
  createdAt: new Date("2026-04-26T00:00:00.000Z"),
  series: {
    title: "Example series",
    slug: "series-example",
  },
} satisfies ContentGetSeriesPostDetailOutput
