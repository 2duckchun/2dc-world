import {
  getPublishedList,
  getPublishedSeriesList,
} from "@/domain/blog/server/public-readers"
import { HomeView } from "@/views/home"

export default async function HomePage() {
  const [blogPosts, memoPosts, booklogPosts, series] = await Promise.all([
    getPublishedList("BLOG", 3),
    getPublishedList("MEMO", 3),
    getPublishedList("BOOKLOG", 3),
    getPublishedSeriesList(4),
  ])

  return (
    <HomeView
      blogPosts={blogPosts}
      memoPosts={memoPosts}
      booklogPosts={booklogPosts}
      series={series}
    />
  )
}
