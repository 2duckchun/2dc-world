import type { Metadata } from "next"
import { getPublishedPostArchive } from "@/domain/content/queries"
import { PostsView } from "@/views/posts"

export const metadata: Metadata = {
  title: "Posts",
  description: "Published standard posts from 2dc world.",
}

export default async function PostsPage() {
  const posts = await getPublishedPostArchive()

  return <PostsView posts={posts} />
}
