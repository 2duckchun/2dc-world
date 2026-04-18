import type { GetBySlugInput, GetBySlugOutput } from "./schema"

export const getBySlugInputFixture: GetBySlugInput = {
  type: "BLOG",
  slug: "welcome-to-2dc-world",
}

export const getBySlugOutputFixture: GetBySlugOutput = {
  id: "post-1",
  type: "BLOG",
  slug: "welcome-to-2dc-world",
  title: "Welcome to 2dc world",
  summary: "A quick introduction to the public reading experience.",
  href: "/blog/welcome-to-2dc-world",
  publishedAt: new Date("2026-04-18T00:00:00.000Z").toISOString(),
  updatedAt: new Date("2026-04-18T00:00:00.000Z").toISOString(),
  tags: [{ id: "tag-1", name: "nextjs" }],
  series: null,
  contentMarkdown: "# Welcome\n\nThis is a sample post.",
}
