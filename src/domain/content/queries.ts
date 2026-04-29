import "server-only"

import { and, asc, desc, eq } from "drizzle-orm"
import { db } from "@/core/db"
import { posts, series } from "@/core/db/schema"
import type { PostKind } from "@/domain/content/types"

const publishedArchiveColumns = {
  id: true,
  title: true,
  slug: true,
  subtitle: true,
  publishedAt: true,
  createdAt: true,
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

const getPublishedArchiveByKind = async (kind: PostKind) =>
  db.query.posts.findMany({
    columns: publishedArchiveColumns,
    where: and(eq(posts.status, "published"), eq(posts.kind, kind)),
    orderBy: getPublishedArchiveOrderBy(),
    with: {
      postTags: publishedPostTagsRelation,
    },
  })

export const getPublishedPostArchive = async () =>
  getPublishedArchiveByKind("post")

export const getPublishedLogArchive = async () =>
  getPublishedArchiveByKind("log")

const getPublishedPostBySlugAndKind = async (slug: string, kind: PostKind) =>
  db.query.posts.findFirst({
    columns: {
      title: true,
      slug: true,
      subtitle: true,
      thumbnail: true,
      content: true,
      publishedAt: true,
      createdAt: true,
    },
    where: and(
      eq(posts.slug, slug),
      eq(posts.status, "published"),
      eq(posts.kind, kind),
    ),
    with: {
      series: {
        columns: {
          title: true,
          slug: true,
        },
      },
    },
  })

export const getPublishedLogBySlug = async (slug: string) =>
  getPublishedPostBySlugAndKind(slug, "log")

export const getPublishedPostBySlug = async (slug: string) =>
  getPublishedPostBySlugAndKind(slug, "post")

export const getPublishedSeriesArchive = async () => {
  const seriesRows = await db.query.series.findMany({
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
    orderBy: [asc(series.title)],
  })

  return seriesRows.filter((seriesRow) => seriesRow.posts.length > 0)
}

export const getPublishedSeriesBySlug = async (seriesSlug: string) => {
  const seriesRow = await db.query.series.findFirst({
    columns: {
      id: true,
      title: true,
      slug: true,
      description: true,
      thumbnail: true,
      createdAt: true,
      updatedAt: true,
    },
    where: eq(series.slug, seriesSlug),
    with: {
      posts: {
        columns: publishedSeriesPostColumns,
        where: and(eq(posts.status, "published"), eq(posts.kind, "series")),
        orderBy: getPublishedSeriesPostOrderBy(),
      },
    },
  })

  if (!seriesRow || seriesRow.posts.length === 0) {
    return null
  }

  return seriesRow
}

export const getPublishedSeriesPostBySlug = async (
  seriesSlug: string,
  postSlug: string,
) => {
  const post = await db.query.posts.findFirst({
    columns: {
      title: true,
      slug: true,
      subtitle: true,
      thumbnail: true,
      content: true,
      publishedAt: true,
      createdAt: true,
    },
    where: and(
      eq(posts.slug, postSlug),
      eq(posts.status, "published"),
      eq(posts.kind, "series"),
    ),
    with: {
      series: {
        columns: {
          title: true,
          slug: true,
        },
      },
    },
  })

  if (!post?.series || post.series.slug !== seriesSlug) {
    return null
  }

  return post
}
