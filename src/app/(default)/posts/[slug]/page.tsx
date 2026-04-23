import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublishedPostBySlug } from "@/domain/content/queries"
import { PostDetailView } from "@/views/post-detail"

type PostDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export const generateMetadata = async ({
  params,
}: PostDetailPageProps): Promise<Metadata> => {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) {
    return {
      title: "글을 찾을 수 없습니다",
    }
  }

  return {
    title: post.title,
    description: post.subtitle ?? undefined,
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <PostDetailView post={post} />
}
