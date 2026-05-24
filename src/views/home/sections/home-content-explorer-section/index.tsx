import { Suspense } from "react"
import { HomeContentExplorer } from "@/views/home/sections/home-content-explorer-section/components/home-content-explorer"
import { getHomeContents } from "./get-home-content"

export async function HomeContentExplorerSection() {
  const { posts, series } = await getHomeContents()
  return (
    <Suspense fallback={null}>
      <HomeContentExplorer posts={posts} series={series} />
    </Suspense>
  )
}
