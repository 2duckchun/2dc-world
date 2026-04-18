import { and, asc, count, desc, eq, inArray } from "drizzle-orm"
import { db } from "@/core/db"
import {
  booklogSeries,
  booklogSeriesEntries,
  posts,
  postTags,
  tags,
} from "@/core/db/schema/blog"
import {
  buildPostHref,
  buildSeriesHref,
  type PostType,
  type PublishedPostDetail,
  type PublishedPostSummary,
  type PublishedSeriesDetail,
  type PublishedSeriesSummary,
  type TagResults,
} from "./model"
import { normalizeStoredSlug } from "./slug"

function toIsoString(value: Date | null) {
  return value ? value.toISOString() : null
}

type PostRow = typeof posts.$inferSelect

type SeriesEntryRow = {
  postId: string
  slug: string
  title: string
  coverImageUrl: string | null
  orderIndex: number
  chapterLabel: string | null
}

async function getTagsByPostIds(postIds: string[]) {
  if (postIds.length === 0) {
    return new Map<string, { id: string; name: string }[]>()
  }

  const rows = await db
    .select({
      postId: postTags.postId,
      tagId: tags.id,
      tagName: tags.name,
    })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(inArray(postTags.postId, postIds))

  const map = new Map<string, { id: string; name: string }[]>()

  for (const row of rows) {
    const bucket = map.get(row.postId) ?? []
    bucket.push({ id: row.tagId, name: row.tagName })
    map.set(row.postId, bucket)
  }

  return map
}

async function getSeriesByPostIds(postIds: string[]) {
  if (postIds.length === 0) {
    return new Map<string, SeriesEntryRow>()
  }

  const rows = await db
    .select({
      postId: booklogSeriesEntries.postId,
      slug: booklogSeries.slug,
      title: booklogSeries.title,
      coverImageUrl: booklogSeries.coverImageUrl,
      orderIndex: booklogSeriesEntries.orderIndex,
      chapterLabel: booklogSeriesEntries.chapterLabel,
    })
    .from(booklogSeriesEntries)
    .innerJoin(
      booklogSeries,
      eq(booklogSeriesEntries.seriesId, booklogSeries.id),
    )
    .where(inArray(booklogSeriesEntries.postId, postIds))

  return new Map(rows.map((row) => [row.postId, row]))
}

function mapPostSummary(
  post: PostRow,
  tagMap: Map<string, { id: string; name: string }[]>,
  seriesMap: Map<string, SeriesEntryRow>,
): PublishedPostSummary {
  const series = seriesMap.get(post.id)

  return {
    id: post.id,
    type: post.type,
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    href: buildPostHref(post.type, post.slug),
    publishedAt: toIsoString(post.publishedAt),
    updatedAt: post.updatedAt.toISOString(),
    tags: tagMap.get(post.id) ?? [],
    series: series
      ? {
          slug: series.slug,
          title: series.title,
          coverImageUrl: series.coverImageUrl,
          href: buildSeriesHref(series.slug),
          orderIndex: series.orderIndex,
          chapterLabel: series.chapterLabel,
        }
      : null,
  }
}

async function hydrateSummaries(postRows: PostRow[]) {
  const postIds = postRows.map((post) => post.id)
  const [tagMap, seriesMap] = await Promise.all([
    getTagsByPostIds(postIds),
    getSeriesByPostIds(postIds),
  ])

  return postRows.map((post) => mapPostSummary(post, tagMap, seriesMap))
}

export async function listPublishedPosts(type: PostType) {
  const postRows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.type, type), eq(posts.status, "PUBLISHED")))
    .orderBy(desc(posts.publishedAt), desc(posts.updatedAt))

  return hydrateSummaries(postRows)
}

export async function getPublishedPostBySlug(input: {
  type: PostType
  slug: string
}) {
  const post = await db.query.posts.findFirst({
    where: and(
      eq(posts.type, input.type),
      eq(posts.slug, normalizeStoredSlug(input.slug)),
      eq(posts.status, "PUBLISHED"),
    ),
  })

  if (!post) {
    return null
  }

  const [summary] = await hydrateSummaries([post])

  return {
    ...summary,
    contentMarkdown: post.contentMarkdown,
  } satisfies PublishedPostDetail
}

export async function listBooklogSeries() {
  const rows = await db
    .select({
      id: booklogSeries.id,
      slug: booklogSeries.slug,
      title: booklogSeries.title,
      description: booklogSeries.description,
      coverImageUrl: booklogSeries.coverImageUrl,
      updatedAt: booklogSeries.updatedAt,
      postCount: count(booklogSeriesEntries.postId),
    })
    .from(booklogSeries)
    .leftJoin(
      booklogSeriesEntries,
      eq(booklogSeriesEntries.seriesId, booklogSeries.id),
    )
    .groupBy(booklogSeries.id)
    .orderBy(desc(booklogSeries.updatedAt), asc(booklogSeries.title))

  return rows.map(
    (row) =>
      ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.description,
        coverImageUrl: row.coverImageUrl,
        href: buildSeriesHref(row.slug),
        postCount: row.postCount,
        updatedAt: row.updatedAt.toISOString(),
      }) satisfies PublishedSeriesSummary,
  )
}

export async function getSeriesBySlug(seriesSlug: string) {
  const series = await db.query.booklogSeries.findFirst({
    where: eq(booklogSeries.slug, normalizeStoredSlug(seriesSlug)),
  })

  if (!series) {
    return null
  }

  const entries = await db
    .select({
      id: posts.id,
      type: posts.type,
      status: posts.status,
      authorId: posts.authorId,
      title: posts.title,
      slug: posts.slug,
      summary: posts.summary,
      contentMarkdown: posts.contentMarkdown,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(booklogSeriesEntries)
    .innerJoin(posts, eq(booklogSeriesEntries.postId, posts.id))
    .where(
      and(
        eq(booklogSeriesEntries.seriesId, series.id),
        eq(posts.status, "PUBLISHED"),
        eq(posts.type, "BOOKLOG"),
      ),
    )
    .orderBy(asc(booklogSeriesEntries.orderIndex), desc(posts.publishedAt))

  const items = await hydrateSummaries(entries)

  return {
    id: series.id,
    slug: series.slug,
    title: series.title,
    description: series.description,
    coverImageUrl: series.coverImageUrl,
    href: buildSeriesHref(series.slug),
    postCount: items.length,
    updatedAt: series.updatedAt.toISOString(),
    items,
  } satisfies PublishedSeriesDetail
}

export async function getPostsByTag(tagName: string) {
  const tag = await db.query.tags.findFirst({
    where: eq(tags.name, tagName),
  })

  if (!tag) {
    return null
  }

  const rows = await db
    .select({
      id: posts.id,
      type: posts.type,
      status: posts.status,
      authorId: posts.authorId,
      title: posts.title,
      slug: posts.slug,
      summary: posts.summary,
      contentMarkdown: posts.contentMarkdown,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(postTags)
    .innerJoin(posts, eq(postTags.postId, posts.id))
    .where(and(eq(postTags.tagId, tag.id), eq(posts.status, "PUBLISHED")))
    .orderBy(desc(posts.publishedAt), desc(posts.updatedAt))

  return {
    tagName: tag.name,
    items: await hydrateSummaries(rows),
  } satisfies TagResults
}
