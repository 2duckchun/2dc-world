import type { ContentGetPostDetailOutput } from "./schema"

export const contentGetPostDetailFixture = {
  title: "First post",
  slug: "first-post",
  subtitle: "Example post detail item.",
  thumbnail: null,
  content: "# First post\n\nExample markdown content.",
  publishedAt: new Date("2026-04-26T00:00:00.000Z"),
  createdAt: new Date("2026-04-26T00:00:00.000Z"),
  series: null,
} satisfies ContentGetPostDetailOutput
