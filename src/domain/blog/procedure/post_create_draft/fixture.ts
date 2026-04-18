import type { PostCreateDraftInput, PostCreateDraftOutput } from "./schema"

export const postCreateDraftInputFixture: PostCreateDraftInput = {
  type: "BLOG",
  title: "Draft blog post",
  slug: null,
  summary: "A work in progress.",
  contentMarkdown: "# Draft\n\nHello world",
  tagNames: ["nextjs"],
  series: null,
}

export const postCreateDraftOutputFixture: PostCreateDraftOutput = {
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
