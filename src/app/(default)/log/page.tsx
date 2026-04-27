import type { Metadata } from "next"
import { getPublishedLogArchive } from "@/domain/content/queries"
import { LogView } from "@/views/log"

export const metadata: Metadata = {
  title: "Log",
  description: "Short development notes, tips, and fixes from 2dc world.",
}

export default async function LogPage() {
  const posts = await getPublishedLogArchive()

  return <LogView posts={posts} />
}
