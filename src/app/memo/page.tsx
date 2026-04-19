import type { Metadata } from "next"
import { getPublishedList } from "@/domain/blog/server/public-readers"
import { MemoListView } from "@/views/memo-list"

export const metadata: Metadata = {
  title: "Memo",
  description: "Dense, scan-friendly memo posts from 2dc world.",
}

export default async function MemoPage() {
  const posts = await getPublishedList("MEMO", 24)

  return <MemoListView posts={posts} />
}
