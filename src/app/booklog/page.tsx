import type { Metadata } from "next"
import { getServerCaller } from "@/core/trpc/server"
import { ReadingListView } from "@/views/public-reading"

export const metadata: Metadata = {
  title: "BOOKLOG | 2dc world",
  description: "Book-driven notes, chapter logs, and ordered reading series.",
}

export default async function BooklogPage() {
  const caller = await getServerCaller()
  const [items, series] = await Promise.all([
    caller.blog.getListPublished({ type: "BOOKLOG" }),
    caller.blog.getSeriesList(),
  ])

  return (
    <ReadingListView
      collection="booklog"
      title="BOOKLOG"
      description="Reading logs and series-based notes that keep sequence and context visible while you browse."
      items={items}
      series={series}
    />
  )
}
