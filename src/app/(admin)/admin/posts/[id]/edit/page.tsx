import type { Metadata } from "next"
import { forbidden, notFound } from "next/navigation"
import { auth } from "@/auth"
import {
  getServerQueryClient,
  PrefetchBoundary,
} from "@/core/tanstack-query/prefetch-boundary"
import { trpcServerProxy } from "@/core/trpc/server/create-trpc-proxy"
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

  const queryClient = getServerQueryClient()
  const postQueryOptions = trpcServerProxy.post.getForEdit.queryOptions({ id })
  const post = await queryClient.fetchQuery(postQueryOptions)

  if (!post) {
    notFound()
  }

  await queryClient.prefetchQuery(
    trpcServerProxy.series.getOptions.queryOptions(),
  )

  return (
    <PrefetchBoundary>
      <AdminPostEditView postId={id} />
    </PrefetchBoundary>
  )
}
