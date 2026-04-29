import { AppRoutes } from "@/shared/utils/app-routes"

export const getPostHref = (post: {
  kind: string
  slug: string
  series: { slug: string } | null
}) => {
  if (post.kind === "log") {
    return AppRoutes.log.post(post.slug)
  }

  if (post.kind === "series") {
    return post.series
      ? AppRoutes.series.post(post.series.slug, post.slug)
      : null
  }

  return AppRoutes.posts.post(post.slug)
}

export const toSortedTags = (
  postTags: readonly {
    tag: {
      id: string
      name: string
      slug: string
    }
  }[],
) =>
  postTags
    .map(({ tag }) => tag)
    .sort((firstTag, secondTag) =>
      firstTag.name.localeCompare(secondTag.name, "ko-KR"),
    )

export const getSeriesLatestDate = (series: {
  updatedAt: Date
  posts: readonly {
    publishedAt: Date | null
    createdAt: Date
  }[]
}) => {
  const latestPost = series.posts.reduce<
    { publishedAt: Date | null; createdAt: Date } | undefined
  >((latest, post) => {
    if (!latest) {
      return post
    }

    const latestTime = (latest.publishedAt ?? latest.createdAt).getTime()
    const postTime = (post.publishedAt ?? post.createdAt).getTime()

    return postTime > latestTime ? post : latest
  }, undefined)

  return latestPost?.publishedAt ?? latestPost?.createdAt ?? series.updatedAt
}
