import type { Metadata } from "next"
import {
  getServerQueryClient,
  PrefetchBoundary,
} from "@/core/tanstack-query/prefetch-boundary"
import { trpcServerProxy } from "@/core/trpc/server/create-trpc-proxy"
import { PostsView } from "@/views/posts"

export const metadata: Metadata = {
  title: "Posts",
  description: "Published standard posts from 2dc world.",
}

export default async function PostsPage() {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(
    trpcServerProxy.content.getPostArchive.queryOptions(),
  )

  return (
    <PrefetchBoundary>
      <PostsView />
    </PrefetchBoundary>
  )
}
