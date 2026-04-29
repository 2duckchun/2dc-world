import { HomeContentExplorer } from "@/views/home/sections/home-content-explorer-section/components/home-content-explorer"
import { getHomeContents } from "./get-home-content"

export async function HomeContentExplorerSection() {
  const { posts, series } = await getHomeContents()
  return <HomeContentExplorer posts={posts} series={series} />
}
