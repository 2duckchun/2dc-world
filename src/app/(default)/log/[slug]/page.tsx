import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { auth } from "@/auth"
import {
  getServerQueryClient,
  PrefetchBoundary,
} from "@/core/tanstack-query/prefetch-boundary"
import { trpcServerProxy } from "@/core/trpc/server/create-trpc-proxy"
import { trpcServerCaller } from "@/core/trpc/server/trpc-server-caller"
import { PostDetailView } from "@/views/post-detail"

type LogDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

const getLogDetail = cache(async (slug: string) => {
  const caller = await trpcServerCaller()

  return caller.content.getLogDetail({ slug })
})

export const generateMetadata = async ({
  params,
}: LogDetailPageProps): Promise<Metadata> => {
  const { slug } = await params
  const post = await getLogDetail(slug)

  if (!post) {
    return {
      title: "로그를 찾을 수 없습니다",
    }
  }

  return {
    title: post.title,
    description: post.subtitle ?? undefined,
  }
}

export default async function LogDetailPage({ params }: LogDetailPageProps) {
  const { slug } = await params
  const post = await getLogDetail(slug)

  if (!post) {
    notFound()
  }

  const queryClient = getServerQueryClient()
  await Promise.all([
    queryClient.prefetchQuery(
      trpcServerProxy.like.getPostStats.queryOptions({ postId: post.id }),
    ),
    queryClient.prefetchQuery(
      trpcServerProxy.comment.list.queryOptions({ postId: post.id }),
    ),
  ])
  const session = await auth()

  return (
    <PrefetchBoundary>
      <PostDetailView post={post} isAuthenticated={Boolean(session?.user)} />
    </PrefetchBoundary>
  )
}
