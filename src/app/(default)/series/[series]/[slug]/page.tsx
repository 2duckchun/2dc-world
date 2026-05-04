import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { trpcServerCaller } from "@/core/trpc/server/trpc-server-caller"
import { PostDetailView } from "@/views/post-detail"

type SeriesPostDetailPageProps = {
  params: Promise<{
    series: string
    slug: string
  }>
}

const getSeriesPostDetail = cache(async (seriesSlug: string, slug: string) => {
  const caller = await trpcServerCaller()

  return caller.content.getSeriesPostDetail({ seriesSlug, slug })
})

export const generateMetadata = async ({
  params,
}: SeriesPostDetailPageProps): Promise<Metadata> => {
  const { series: seriesSlug, slug } = await params
  const post = await getSeriesPostDetail(seriesSlug, slug)

  if (!post) {
    return {
      title: "회차를 찾을 수 없습니다",
    }
  }

  return {
    title: post.title,
    description: post.subtitle ?? undefined,
  }
}

export default async function SeriesPostDetailPage({
  params,
}: SeriesPostDetailPageProps) {
  const { series: seriesSlug, slug } = await params
  const post = await getSeriesPostDetail(seriesSlug, slug)

  if (!post) {
    notFound()
  }

  return <PostDetailView post={post} />
}
