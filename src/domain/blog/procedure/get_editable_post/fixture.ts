import type { GetEditablePostInput, GetEditablePostOutput } from "./schema"

export const getEditablePostInputFixture: GetEditablePostInput = {
  type: "BLOG",
  slug: "draft-blog-post",
}

export const getEditablePostOutputFixture: GetEditablePostOutput = {
  id: "post-1",
  type: "BLOG",
  status: "DRAFT",
  title: "Draft blog post",
  slug: "draft-blog-post",
  summary: "A work in progress.",
  contentMarkdown: "# Draft\n\nHello world",
  publishedAt: null,
  updatedAt: new Date("2026-04-19T00:00:00.000Z").toISOString(),
  tagNames: ["nextjs"],
  series: null,
}
