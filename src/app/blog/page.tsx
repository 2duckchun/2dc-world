import type { Metadata } from "next"
import { getServerCaller } from "@/core/trpc/server"
import { ReadingListView } from "@/views/public-reading"

export const metadata: Metadata = {
  title: "BLOG | 2dc world",
  description: "Long-form posts and polished write-ups from 2dc world.",
}

export default async function BlogPage() {
  const caller = await getServerCaller()
  const items = await caller.blog.getListPublished({ type: "BLOG" })

  return (
    <ReadingListView
      collection="blog"
      title="BLOG"
      description="Long-form writing, polished notes, and essays intended to be read end-to-end."
      items={items}
    />
  )
}
