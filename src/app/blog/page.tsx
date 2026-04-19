import type { Metadata } from "next"
import { getPublishedList } from "@/domain/blog/server/public-readers"
import { BlogListView } from "@/views/blog-list"

export const metadata: Metadata = {
  title: "Blog",
  description: "Long-form essays and polished notes from 2dc world.",
}

export default async function BlogPage() {
  const posts = await getPublishedList("BLOG", 18)

  return <BlogListView posts={posts} />
}
