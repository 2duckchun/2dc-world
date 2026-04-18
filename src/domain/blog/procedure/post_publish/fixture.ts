import type { PostPublishInput, PostPublishOutput } from "./schema"

export const postPublishInputFixture: PostPublishInput = {
  postId: "post-1",
}

export const postPublishOutputFixture: PostPublishOutput = {
  id: "post-1",
  type: "BLOG",
  status: "PUBLISHED",
  title: "Published blog post",
  slug: "published-blog-post",
  summary: "A published post.",
  contentMarkdown: "# Published\n\nHello world",
  publishedAt: new Date("2026-04-19T00:00:00.000Z").toISOString(),
  updatedAt: new Date("2026-04-19T00:00:00.000Z").toISOString(),
  tagNames: ["nextjs"],
  series: null,
}
