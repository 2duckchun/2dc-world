import { trpcServerCaller } from "@/core/trpc/server/trpc-server-caller"
import { buildRssFeed } from "@/shared/lib/rss/build-feed"
import type { FeedItemInput } from "@/shared/lib/rss/types"
import { AppRoutes } from "@/shared/utils/app-routes"
import { SITE_URL } from "@/shared/utils/metadata"

export const dynamic = "force-static"
export const revalidate = 600

const toAbsoluteUrl = (path: string) => `${SITE_URL}${path}`

export const GET = async () => {
  const caller = await trpcServerCaller()
  const [postRows, logRows, seriesRows] = await Promise.all([
    caller.content.getPostArchive(),
    caller.content.getLogArchive(),
    caller.content.getSeriesArchive(),
  ])

  const items: FeedItemInput[] = []

  for (const post of postRows) {
    if (!post.publishedAt) continue
    items.push({
      title: post.title,
      link: toAbsoluteUrl(AppRoutes.posts.post(post.slug)),
      publishedAt: post.publishedAt,
      description: post.subtitle ?? undefined,
      categories: post.postTags.map(({ tag }) => tag.name),
    })
  }

  for (const log of logRows) {
    if (!log.publishedAt) continue
    items.push({
      title: log.title,
      link: toAbsoluteUrl(AppRoutes.log.post(log.slug)),
      publishedAt: log.publishedAt,
      description: log.subtitle ?? undefined,
      categories: log.postTags.map(({ tag }) => tag.name),
    })
  }

  for (const seriesItem of seriesRows) {
    for (const seriesPost of seriesItem.posts) {
      if (!seriesPost.publishedAt) continue
      items.push({
        title: seriesPost.title,
        link: toAbsoluteUrl(
          AppRoutes.series.post(seriesItem.slug, seriesPost.slug),
        ),
        publishedAt: seriesPost.publishedAt,
        description: seriesPost.subtitle ?? undefined,
      })
    }
  }

  const xml = buildRssFeed(items)

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
    },
  })
}
