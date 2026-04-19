import type { Metadata } from "next"
import {
  getPublishedList,
  getPublishedSeriesList,
} from "@/domain/blog/server/public-readers"
import { BooklogIndexView } from "@/views/booklog-index"

export const metadata: Metadata = {
  title: "Booklog",
  description: "Ordered reading logs, series pages, and standalone book notes.",
}

export default async function BooklogPage() {
  const [posts, series] = await Promise.all([
    getPublishedList("BOOKLOG", 18),
    getPublishedSeriesList(8),
  ])

  return <BooklogIndexView posts={posts} series={series} />
}
