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
import { AppRoutes } from "@/shared/utils/app-routes"
import { buildArticleMetadata } from "@/shared/utils/metadata"
import { PostDetailView } from "@/views/post-detail"
import { PostViewerAdminActions } from "@/widgets/post/post-viewer-admin-actions"

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

  return buildArticleMetadata({
    title: post.title,
    description: post.subtitle,
    thumbnail: post.thumbnail,
    publishedTime: post.publishedAt ?? post.createdAt,
  })
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
  const isAdmin = session?.user?.role === "admin"

  return (
    <PrefetchBoundary>
      <div className="grid w-full gap-3">
        {isAdmin && (
          <PostViewerAdminActions
            postId={post.id}
            listHref={AppRoutes.log.list()}
          />
        )}
        <PostDetailView post={post} isAuthenticated={Boolean(session?.user)} />
      </div>
    </PrefetchBoundary>
  )
}
