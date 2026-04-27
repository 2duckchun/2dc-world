import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublishedLogBySlug } from "@/domain/content/queries"
import { PostDetailView } from "@/views/post-detail"

type LogDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export const generateMetadata = async ({
  params,
}: LogDetailPageProps): Promise<Metadata> => {
  const { slug } = await params
  const post = await getPublishedLogBySlug(slug)

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
  const post = await getPublishedLogBySlug(slug)

  if (!post) {
    notFound()
  }

  return <PostDetailView post={post} />
}
