import type { ContentGetLogDetailOutput } from "./schema"

export const contentGetLogDetailFixture = {
  title: "First log",
  slug: "first-log",
  subtitle: "Example log detail item.",
  thumbnail: null,
  content: "# First log\n\nExample markdown content.",
  publishedAt: new Date("2026-04-26T00:00:00.000Z"),
  createdAt: new Date("2026-04-26T00:00:00.000Z"),
  series: null,
} satisfies ContentGetLogDetailOutput
