import type { Metadata } from "next"
import { forbidden } from "next/navigation"
import { auth } from "@/auth"
import {
  getServerQueryClient,
  PrefetchBoundary,
} from "@/core/tanstack-query/prefetch-boundary"
import { trpcServerProxy } from "@/core/trpc/server/create-trpc-proxy"
import { AdminPostsView } from "@/views/admin-posts"

export const metadata: Metadata = {
  title: "게시글 관리",
}

export default async function AdminPostsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    forbidden()
  }

  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(
    trpcServerProxy.post.listForAdmin.queryOptions(),
  )

  return (
    <PrefetchBoundary>
      <AdminPostsView />
    </PrefetchBoundary>
  )
}
