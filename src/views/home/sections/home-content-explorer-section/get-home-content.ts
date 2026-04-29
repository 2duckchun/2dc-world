import { trpcServerCaller } from "@/core/trpc/server/trpc-server-caller"
import { AppRoutes } from "@/shared/utils/app-routes"
import type { HomeContentExplorerProps } from "./components/home-content-explorer"
import { getPostHref, getSeriesLatestDate, toSortedTags } from "./utils"

type HomeContentPost = HomeContentExplorerProps["posts"][number]
type HomeContentSeries = HomeContentExplorerProps["series"][number]

export const getHomeContents = async () => {
  const caller = await trpcServerCaller()
  const content = await caller.content.getHomeContent()

  const posts = content.posts.flatMap((post) => {
    const href = getPostHref(post)
    if (!href) {
      return []
    }
    return [
      {
        id: post.id,
        title: post.title,
        href,
        kind: post.kind,
        subtitle: post.subtitle,
        publishedAt: post.publishedAt?.toISOString() ?? null,
        createdAt: post.createdAt.toISOString(),
        tags: toSortedTags(post.postTags),
      } satisfies HomeContentPost,
    ]
  })

  const series = content.series.map(
    (seriesItem) =>
      ({
        id: seriesItem.id,
        title: seriesItem.title,
        href: AppRoutes.series.detail(seriesItem.slug),
        description: seriesItem.description,
        thumbnail: seriesItem.thumbnail,
        episodeCount: seriesItem.posts.length,
        latestAt: getSeriesLatestDate(seriesItem).toISOString(),
      }) satisfies HomeContentSeries,
  )

  return {
    posts,
    series,
  }
}
