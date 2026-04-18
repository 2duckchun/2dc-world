import type { PostCreateSeriesInput, PostCreateSeriesOutput } from "./schema"

export const postCreateSeriesInputFixture: PostCreateSeriesInput = {
  title: "Modern Web Notes",
  slug: null,
  description: "A running set of BOOKLOG entries.",
  coverImageUrl: null,
}

export const postCreateSeriesOutputFixture: PostCreateSeriesOutput = {
  id: "series-1",
  slug: "modern-web-notes",
  title: "Modern Web Notes",
  description: "A running set of BOOKLOG entries.",
  coverImageUrl: null,
  createdAt: new Date("2026-04-19T00:00:00.000Z").toISOString(),
  updatedAt: new Date("2026-04-19T00:00:00.000Z").toISOString(),
}
