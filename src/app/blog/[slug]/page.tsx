import { TRPCError } from "@trpc/server"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServerCaller } from "@/core/trpc/server"
import { PostDetailView } from "@/views/public-reading"

type BlogDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

async function getPost(slug: string) {
  const caller = await getServerCaller()

  try {
    return await caller.blog.getBySlug({ type: "BLOG", slug })
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return null
    }

    throw error
  }
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await getPost(slug)

  if (!item) {
    return {
      title: "Post not found | 2dc world",
    }
  }

  return {
    title: `${item.title} | 2dc world`,
    description: item.summary ?? `Read ${item.title} on 2dc world.`,
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params
  const item = await getPost(slug)

  if (!item) {
    notFound()
  }

  return <PostDetailView item={item} />
}
