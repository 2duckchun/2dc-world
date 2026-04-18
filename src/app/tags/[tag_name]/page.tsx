import { TRPCError } from "@trpc/server"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServerCaller } from "@/core/trpc/server"
import { TagResultsView } from "@/views/public-reading"

type TagPageProps = {
  params: Promise<{
    tag_name: string
  }>
}

async function getTagResults(tagName: string) {
  const caller = await getServerCaller()

  try {
    return await caller.blog.getByTag({ tagName: decodeURIComponent(tagName) })
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return null
    }

    throw error
  }
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag_name } = await params
  const results = await getTagResults(tag_name)

  if (!results) {
    return {
      title: "Tag not found | 2dc world",
    }
  }

  return {
    title: `#${results.tagName} | 2dc world`,
    description: `Published posts currently tagged with ${results.tagName}.`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag_name } = await params
  const results = await getTagResults(tag_name)

  if (!results) {
    notFound()
  }

  return <TagResultsView results={results} />
}
