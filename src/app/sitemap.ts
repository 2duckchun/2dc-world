import type { MetadataRoute } from "next"
import { trpcServerCaller } from "@/core/trpc/server/trpc-server-caller"
import { AppRoutes } from "@/shared/utils/app-routes"
import { SITE_URL } from "@/shared/utils/metadata"

const toAbsoluteUrl = (path: string) => `${SITE_URL}${path}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const caller = await trpcServerCaller()
  const [postRows, logRows, seriesRows] = await Promise.all([
    caller.content.getPostArchive(),
    caller.content.getLogArchive(),
    caller.content.getSeriesArchive(),
  ])

  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: toAbsoluteUrl(AppRoutes.home()), lastModified: now },
    { url: toAbsoluteUrl(AppRoutes.posts.list()), lastModified: now },
    { url: toAbsoluteUrl(AppRoutes.log.list()), lastModified: now },
    { url: toAbsoluteUrl(AppRoutes.series.list()), lastModified: now },
  ]

  const postPages: MetadataRoute.Sitemap = postRows.map((post) => ({
    url: toAbsoluteUrl(AppRoutes.posts.post(post.slug)),
    lastModified: post.publishedAt ?? post.createdAt,
  }))

  const logPages: MetadataRoute.Sitemap = logRows.map((log) => ({
    url: toAbsoluteUrl(AppRoutes.log.post(log.slug)),
    lastModified: log.publishedAt ?? log.createdAt,
  }))

  const seriesPages: MetadataRoute.Sitemap = []
  for (const seriesItem of seriesRows) {
    seriesPages.push({
      url: toAbsoluteUrl(AppRoutes.series.detail(seriesItem.slug)),
      lastModified: seriesItem.updatedAt,
    })
    for (const seriesPost of seriesItem.posts) {
      seriesPages.push({
        url: toAbsoluteUrl(
          AppRoutes.series.post(seriesItem.slug, seriesPost.slug),
        ),
        lastModified: seriesPost.publishedAt ?? seriesPost.createdAt,
      })
    }
  }

  return [...staticPages, ...postPages, ...logPages, ...seriesPages]
}
