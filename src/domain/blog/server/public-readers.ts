import { cache } from "react"
import { getServerCaller } from "@/core/trpc/server"
import type { BlogPostType } from "@/domain/blog/model"

export const getPublishedList = cache(
  async (type: BlogPostType, limit = 18) => {
    const caller = await getServerCaller()
    return caller.blog.getListPublished({ type, limit })
  },
)

export const getPublishedPost = cache(
  async (type: BlogPostType, slug: string) => {
    const caller = await getServerCaller()
    return caller.blog.getBySlug({ type, slug })
  },
)

export const getPublishedSeriesList = cache(async (limit = 6) => {
  const caller = await getServerCaller()
  return caller.blog.getSeriesList({ limit })
})

export const getPublishedSeries = cache(async (seriesSlug: string) => {
  const caller = await getServerCaller()
  return caller.blog.getSeriesBySlug({ seriesSlug })
})

export const getPublishedTagArchive = cache(async (tagName: string) => {
  const caller = await getServerCaller()
  return caller.blog.getByTag({ tagName })
})
