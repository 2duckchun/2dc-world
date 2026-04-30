import type { Metadata } from "next"
import { forbidden } from "next/navigation"
import { auth } from "@/auth"
import {
  getServerQueryClient,
  PrefetchBoundary,
} from "@/core/tanstack-query/prefetch-boundary"
import { trpcServerProxy } from "@/core/trpc/server/create-trpc-proxy"
import { AdminPostCreateView } from "@/views/admin-post-create"

export const metadata: Metadata = {
  title: "새 글 작성",
}

export default async function AdminPostCreatePage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    forbidden()
  }

  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(
    trpcServerProxy.series.getOptions.queryOptions(),
  )

  return (
    <PrefetchBoundary>
      <AdminPostCreateView />
    </PrefetchBoundary>
  )
}
