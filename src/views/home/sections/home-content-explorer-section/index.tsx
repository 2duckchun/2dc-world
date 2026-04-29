import { getPublishedHomeContent } from "@/domain/content/queries"
import { HomeContentExplorer } from "@/views/home/sections/home-content-explorer-section/components/home-content-explorer"
import type {
  HomeContentPost,
  HomeContentSeries,
} from "@/views/home/sections/home-content-explorer-section/components/home-content-types"

const getPostHref = (post: {
  kind: string
  slug: string
  series: { slug: string } | null
}) => {
  if (post.kind === "log") {
    return `/log/${post.slug}`
  }

  if (post.kind === "series") {
    return post.series ? `/series/${post.series.slug}/${post.slug}` : null
  }

  return `/posts/${post.slug}`
}

const toSortedTags = (
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

const getSeriesLatestDate = (series: {
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

export async function HomeContentExplorerSection() {
  const content = await getPublishedHomeContent()
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
        href: `/series/${seriesItem.slug}`,
        description: seriesItem.description,
        thumbnail: seriesItem.thumbnail,
        episodeCount: seriesItem.posts.length,
        latestAt: getSeriesLatestDate(seriesItem).toISOString(),
      }) satisfies HomeContentSeries,
  )

  return <HomeContentExplorer posts={posts} series={series} />
}
