import type { PostUpdateDraftInput, PostUpdateDraftOutput } from "./schema"

export const postUpdateDraftInputFixture: PostUpdateDraftInput = {
  postId: "post-1",
  title: "Updated draft blog post",
  slug: "updated-draft-blog-post",
  summary: "A work in progress.",
  contentMarkdown: "# Draft\n\nUpdated content",
  tagNames: ["nextjs", "react"],
  series: null,
}

export const postUpdateDraftOutputFixture: PostUpdateDraftOutput = {
  id: "post-1",
  type: "BLOG",
  status: "DRAFT",
  title: "Updated draft blog post",
  slug: "updated-draft-blog-post",
  summary: "A work in progress.",
  contentMarkdown: "# Draft\n\nUpdated content",
  publishedAt: null,
  updatedAt: new Date("2026-04-19T00:00:00.000Z").toISOString(),
  tagNames: ["nextjs", "react"],
  series: null,
}
