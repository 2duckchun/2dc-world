import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { parsePublicPostTypeSegment } from "@/domain/blog/model"
import { getPublishedPost } from "@/domain/blog/server/public-readers"
import { PostDetailView } from "@/views/post-detail"

type PostDetailPageProps = {
  params: Promise<{ type: string; slug: string }>
}

export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const { type: typeSegment, slug } = await params
  const type = parsePublicPostTypeSegment(typeSegment)

  if (!type) {
    return {
      title: "Post not found",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const post = await getPublishedPost(type, slug)

  if (!post) {
    return {
      title: "Post not found",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return {
    title: post.title,
    description: post.summary,
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { type: typeSegment, slug } = await params
  const type = parsePublicPostTypeSegment(typeSegment)

  if (!type) {
    notFound()
  }

  const post = await getPublishedPost(type, slug)

  if (!post) {
    notFound()
  }

  return <PostDetailView post={post} />
}
