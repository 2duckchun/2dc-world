import type { Metadata } from "next"
import { getServerCaller } from "@/core/trpc/server"
import { ReadingListView } from "@/views/public-reading"

export const metadata: Metadata = {
  title: "MEMO | 2dc world",
  description: "Short notes, references, and ongoing engineering memos.",
}

export default async function MemoPage() {
  const caller = await getServerCaller()
  const items = await caller.blog.getListPublished({ type: "MEMO" })

  return (
    <ReadingListView
      collection="memo"
      title="MEMO"
      description="Short-form notes, references, and learnings that are meant to be scanned quickly."
      items={items}
    />
  )
}
