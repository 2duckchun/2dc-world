import type { GetSeriesBySlugInput, GetSeriesBySlugOutput } from "./schema"

export const getSeriesBySlugInputFixture: GetSeriesBySlugInput = {
  seriesSlug: "modern-web-notes",
}

export const getSeriesBySlugOutputFixture: GetSeriesBySlugOutput = {
  id: "series-1",
  slug: "modern-web-notes",
  title: "Modern Web Notes",
  description:
    "A running set of BOOKLOG entries about modern web architecture.",
  coverImageUrl: null,
  href: "/booklog/series/modern-web-notes",
  postCount: 1,
  updatedAt: new Date("2026-04-18T00:00:00.000Z").toISOString(),
  items: [
    {
      id: "post-1",
      type: "BOOKLOG",
      slug: "learning-nextjs-16",
      title: "Learning Next.js 16",
      summary: "Thoughts and notes while reading about the newest release.",
      href: "/booklog/learning-nextjs-16",
      publishedAt: new Date("2026-04-18T00:00:00.000Z").toISOString(),
      updatedAt: new Date("2026-04-18T00:00:00.000Z").toISOString(),
      tags: [{ id: "tag-1", name: "nextjs" }],
      series: {
        slug: "modern-web-notes",
        title: "Modern Web Notes",
        coverImageUrl: null,
        href: "/booklog/series/modern-web-notes",
        orderIndex: 1,
        chapterLabel: "Chapter 1",
      },
    },
  ],
}
