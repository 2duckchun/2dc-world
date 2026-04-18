import type { GetDraftListInput, GetDraftListOutput } from "./schema"

export const getDraftListInputFixture: GetDraftListInput = {
  type: "BLOG",
}

export const getDraftListOutputFixture: GetDraftListOutput = [
  {
    id: "post-1",
    type: "BLOG",
    status: "DRAFT",
    title: "Draft blog post",
    slug: "draft-blog-post",
    summary: "A work in progress.",
    updatedAt: new Date("2026-04-19T00:00:00.000Z").toISOString(),
    publishedAt: null,
  },
]
