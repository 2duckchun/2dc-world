import { TRPCError } from "@trpc/server"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServerCaller } from "@/core/trpc/server"
import { PostDetailView } from "@/views/public-reading"

type BooklogDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

async function getPost(slug: string) {
  const caller = await getServerCaller()

  try {
    return await caller.blog.getBySlug({ type: "BOOKLOG", slug })
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return null
    }

    throw error
  }
}

export async function generateMetadata({
  params,
}: BooklogDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await getPost(slug)

  if (!item) {
    return {
      title: "Booklog entry not found | 2dc world",
    }
  }

  return {
    title: `${item.title} | 2dc world`,
    description: item.summary ?? `Read ${item.title} on 2dc world.`,
  }
}

export default async function BooklogDetailPage({
  params,
}: BooklogDetailPageProps) {
  const { slug } = await params
  const item = await getPost(slug)

  if (!item) {
    notFound()
  }

  return <PostDetailView item={item} />
}
