import { and, asc, desc, eq } from "drizzle-orm"
import { posts, series } from "@/core/db/schema"
import { publicProcedure } from "@/core/trpc/base/procedures/public-procedure"
import {
  contentGetHomeContentInputSchema,
  contentGetHomeContentOutputSchema,
} from "./schema"

const publishedHomePostColumns = {
  id: true,
  title: true,
  slug: true,
  subtitle: true,
  publishedAt: true,
  createdAt: true,
  kind: true,
} as const

const getPublishedArchiveOrderBy = () => [
  desc(posts.publishedAt),
  desc(posts.createdAt),
]

const publishedSeriesPostColumns = {
  id: true,
  title: true,
  slug: true,
  subtitle: true,
  publishedAt: true,
  createdAt: true,
  seriesOrder: true,
} as const

const getPublishedSeriesPostOrderBy = () => [
  asc(posts.seriesOrder),
  asc(posts.publishedAt),
  asc(posts.createdAt),
]

const publishedPostTagsRelation = {
  columns: {},
  with: {
    tag: {
      columns: {
        id: true,
        name: true,
        slug: true,
      },
    },
  },
} as const

const getSeriesLatestTimestamp = (seriesRow: {
  updatedAt: Date
  posts: readonly {
    publishedAt: Date | null
    createdAt: Date
  }[]
}) => {
  const latestPost = seriesRow.posts.reduce<
    { publishedAt: Date | null; createdAt: Date } | undefined
  >((latest, post) => {
    if (!latest) {
      return post
    }

    const latestTime = (latest.publishedAt ?? latest.createdAt).getTime()
    const postTime = (post.publishedAt ?? post.createdAt).getTime()

    return postTime > latestTime ? post : latest
  }, undefined)

  return (
    latestPost?.publishedAt ??
    latestPost?.createdAt ??
    seriesRow.updatedAt
  ).getTime()
}

export const contentGetHomeContentProcedure = publicProcedure
  .input(contentGetHomeContentInputSchema)
  .output(contentGetHomeContentOutputSchema)
  .query(async ({ ctx }) => {
    const [postRows, seriesRows] = await Promise.all([
      ctx.db.query.posts.findMany({
        columns: publishedHomePostColumns,
        where: eq(posts.status, "published"),
        orderBy: getPublishedArchiveOrderBy(),
        with: {
          series: {
            columns: {
              title: true,
              slug: true,
            },
          },
          postTags: publishedPostTagsRelation,
        },
      }),
      ctx.db.query.series.findMany({
        columns: {
          id: true,
          title: true,
          slug: true,
          description: true,
          thumbnail: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          posts: {
            columns: publishedSeriesPostColumns,
            where: and(eq(posts.status, "published"), eq(posts.kind, "series")),
            orderBy: getPublishedSeriesPostOrderBy(),
          },
        },
      }),
    ])

    return {
      posts: postRows,
      series: seriesRows
        .filter((seriesRow) => seriesRow.posts.length > 0)
        .sort(
          (firstSeries, secondSeries) =>
            getSeriesLatestTimestamp(secondSeries) -
            getSeriesLatestTimestamp(firstSeries),
        ),
    }
  })
