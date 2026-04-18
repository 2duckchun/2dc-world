import type { GetSeriesListOutput } from "./schema"

export const getSeriesListOutputFixture: GetSeriesListOutput = [
  {
    id: "series-1",
    slug: "modern-web-notes",
    title: "Modern Web Notes",
    description:
      "A running set of BOOKLOG entries about modern web architecture.",
    coverImageUrl: null,
    href: "/booklog/series/modern-web-notes",
    postCount: 2,
    updatedAt: new Date("2026-04-18T00:00:00.000Z").toISOString(),
  },
]
