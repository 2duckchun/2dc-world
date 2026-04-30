import type { Metadata } from "next"
import { forbidden, notFound } from "next/navigation"
import { auth } from "@/auth"
import {
  getServerQueryClient,
  PrefetchBoundary,
} from "@/core/tanstack-query/prefetch-boundary"
import { trpcServerProxy } from "@/core/trpc/server/create-trpc-proxy"
import { trpcServerCaller } from "@/core/trpc/server/trpc-server-caller"
import { AdminPostEditView } from "@/views/admin-post-edit"

type AdminPostEditPageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: "게시글 수정",
}

export default async function AdminPostEditPage({
  params,
}: AdminPostEditPageProps) {
  const { id } = await params

  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    forbidden()
  }

  const caller = await trpcServerCaller()
  const post = await caller.post.getForEdit({ id })

  if (!post) {
    notFound()
  }

  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(
    trpcServerProxy.series.getOptions.queryOptions(),
  )

  return (
    <PrefetchBoundary>
      <AdminPostEditView post={post} />
    </PrefetchBoundary>
  )
}
