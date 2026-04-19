import {
  and,
  asc,
  desc,
  eq,
  gt,
  inArray,
  isNotNull,
  lt,
  or,
  sql,
} from "drizzle-orm"
import { db } from "@/core/db"
import {
  booklogSeries,
  booklogSeriesEntries,
  posts,
  postTags,
  tags,
} from "@/core/db/schema"
import type {
  BlogPostDetail,
  BlogPostNavigationItem,
  BlogPostSummary,
  BlogPostType,
  BooklogSeriesDetail,
  BooklogSeriesSummary,
} from "@/domain/blog/model"
import {
  buildExcerpt,
  estimateReadingMinutes,
} from "@/shared/lib/markdown-text"

type PostRow = {
  id: string
  type: BlogPostType
  slug: string
  title: string
  summary: string
  contentMarkdown: string
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

function toIsoString(value: Date | null | undefined) {
  return value ? value.toISOString() : null
}

function ensureDate(value: Date | null | undefined) {
  return value ?? new Date(0)
}

function buildNavigationItem(input: {
  type: BlogPostType
  slug: string
  title: string
  publishedAt: Date | null
  orderIndex?: number | null
  chapterLabel?: string | null
}): BlogPostNavigationItem {
  return {
    type: input.type,
    slug: input.slug,
    title: input.title,
    publishedAt:
      toIsoString(ensureDate(input.publishedAt)) ?? new Date(0).toISOString(),
    orderIndex: input.orderIndex ?? null,
    chapterLabel: input.chapterLabel ?? null,
  }
}

async function getTagNamesByPostIds(postIds: string[]) {
  if (postIds.length === 0) {
    return new Map<string, string[]>()
  }

  const rows = await db
    .select({
      postId: postTags.postId,
      name: tags.name,
    })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(inArray(postTags.postId, postIds))
    .orderBy(asc(tags.name))

  const map = new Map<string, string[]>()

  for (const row of rows) {
    const existing = map.get(row.postId) ?? []
    existing.push(row.name)
    map.set(row.postId, existing)
  }

  return map
}

async function getSeriesMembershipByPostIds(postIds: string[]) {
  if (postIds.length === 0) {
    return new Map<string, BlogPostSummary["series"]>()
  }

  const rows = await db
    .select({
      postId: booklogSeriesEntries.postId,
      seriesSlug: booklogSeries.slug,
      seriesTitle: booklogSeries.title,
      orderIndex: booklogSeriesEntries.orderIndex,
      chapterLabel: booklogSeriesEntries.chapterLabel,
    })
    .from(booklogSeriesEntries)
    .innerJoin(
      booklogSeries,
      eq(booklogSeriesEntries.seriesId, booklogSeries.id),
    )
    .where(inArray(booklogSeriesEntries.postId, postIds))
    .orderBy(asc(booklogSeriesEntries.orderIndex), asc(booklogSeries.title))

  const map = new Map<string, BlogPostSummary["series"]>()

  for (const row of rows) {
    if (map.has(row.postId)) {
      continue
    }

    map.set(row.postId, {
      slug: row.seriesSlug,
      title: row.seriesTitle,
      orderIndex: row.orderIndex,
      chapterLabel: row.chapterLabel,
    })
  }

  return map
}

async function hydratePostSummaries(
  rows: PostRow[],
): Promise<BlogPostSummary[]> {
  const postIds = rows.map((row) => row.id)
  const [tagMap, seriesMap] = await Promise.all([
    getTagNamesByPostIds(postIds),
    getSeriesMembershipByPostIds(postIds),
  ])

  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    slug: row.slug,
    title: row.title,
    summary: buildExcerpt(row.summary, row.contentMarkdown),
    publishedAt:
      toIsoString(ensureDate(row.publishedAt)) ?? new Date(0).toISOString(),
    readingMinutes: estimateReadingMinutes(row.contentMarkdown),
    tagNames: tagMap.get(row.id) ?? [],
    series: seriesMap.get(row.id) ?? null,
  }))
}

export async function listPublishedPostsByType(
  type: BlogPostType,
  limit: number,
) {
  const rows = await db
    .select({
      id: posts.id,
      type: posts.type,
      slug: posts.slug,
      title: posts.title,
      summary: posts.summary,
      contentMarkdown: posts.contentMarkdown,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .where(
      and(
        eq(posts.type, type),
        eq(posts.status, "PUBLISHED"),
        isNotNull(posts.publishedAt),
      ),
    )
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
    .limit(limit)

  return hydratePostSummaries(rows)
}

async function getChronologicalNavigation(post: PostRow) {
  const publishedAt = ensureDate(post.publishedAt)

  const [previousRow] = await db
    .select({
      type: posts.type,
      slug: posts.slug,
      title: posts.title,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(
      and(
        eq(posts.type, post.type),
        eq(posts.status, "PUBLISHED"),
        isNotNull(posts.publishedAt),
        or(
          gt(posts.publishedAt, publishedAt),
          and(
            eq(posts.publishedAt, publishedAt),
            gt(posts.createdAt, post.createdAt),
          ),
        ),
      ),
    )
    .orderBy(asc(posts.publishedAt), asc(posts.createdAt))
    .limit(1)

  const [nextRow] = await db
    .select({
      type: posts.type,
      slug: posts.slug,
      title: posts.title,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(
      and(
        eq(posts.type, post.type),
        eq(posts.status, "PUBLISHED"),
        isNotNull(posts.publishedAt),
        or(
          lt(posts.publishedAt, publishedAt),
          and(
            eq(posts.publishedAt, publishedAt),
            lt(posts.createdAt, post.createdAt),
          ),
        ),
      ),
    )
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
    .limit(1)

  return {
    previousPost: previousRow ? buildNavigationItem(previousRow) : null,
    nextPost: nextRow ? buildNavigationItem(nextRow) : null,
  }
}

export async function getPublishedPostBySlug(
  type: BlogPostType,
  slug: string,
): Promise<BlogPostDetail | null> {
  const [post] = await db
    .select({
      id: posts.id,
      type: posts.type,
      slug: posts.slug,
      title: posts.title,
      summary: posts.summary,
      contentMarkdown: posts.contentMarkdown,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .where(
      and(
        eq(posts.type, type),
        eq(posts.slug, slug),
        eq(posts.status, "PUBLISHED"),
        isNotNull(posts.publishedAt),
      ),
    )
    .limit(1)

  if (!post) {
    return null
  }

  const [tagMap, membershipRows] = await Promise.all([
    getTagNamesByPostIds([post.id]),
    db
      .select({
        seriesId: booklogSeries.id,
        seriesSlug: booklogSeries.slug,
        seriesTitle: booklogSeries.title,
        seriesDescription: booklogSeries.description,
        orderIndex: booklogSeriesEntries.orderIndex,
        chapterLabel: booklogSeriesEntries.chapterLabel,
      })
      .from(booklogSeriesEntries)
      .innerJoin(
        booklogSeries,
        eq(booklogSeriesEntries.seriesId, booklogSeries.id),
      )
      .where(eq(booklogSeriesEntries.postId, post.id))
      .orderBy(asc(booklogSeriesEntries.orderIndex), asc(booklogSeries.title)),
  ])

  const membership = membershipRows[0]
  const chronologicalNavigation = await getChronologicalNavigation(post)

  let navigationMode: BlogPostDetail["navigationMode"] = "chronological"
  let previousPost = chronologicalNavigation.previousPost
  let nextPost = chronologicalNavigation.nextPost
  let series: BlogPostDetail["series"] = null

  if (membership) {
    const seriesRows = await db
      .select({
        type: posts.type,
        slug: posts.slug,
        title: posts.title,
        publishedAt: posts.publishedAt,
        orderIndex: booklogSeriesEntries.orderIndex,
        chapterLabel: booklogSeriesEntries.chapterLabel,
        postId: posts.id,
      })
      .from(booklogSeriesEntries)
      .innerJoin(posts, eq(booklogSeriesEntries.postId, posts.id))
      .where(
        and(
          eq(booklogSeriesEntries.seriesId, membership.seriesId),
          eq(posts.type, "BOOKLOG"),
          eq(posts.status, "PUBLISHED"),
          isNotNull(posts.publishedAt),
        ),
      )
      .orderBy(asc(booklogSeriesEntries.orderIndex), desc(posts.publishedAt))

    const currentIndex = seriesRows.findIndex((row) => row.postId === post.id)
    const previousSeriesRow =
      currentIndex > 0 ? seriesRows[currentIndex - 1] : null
    const nextSeriesRow =
      currentIndex >= 0 && currentIndex < seriesRows.length - 1
        ? seriesRows[currentIndex + 1]
        : null

    navigationMode = "series"
    previousPost = previousSeriesRow
      ? buildNavigationItem(previousSeriesRow)
      : null
    nextPost = nextSeriesRow ? buildNavigationItem(nextSeriesRow) : null
    series = {
      slug: membership.seriesSlug,
      title: membership.seriesTitle,
      description: membership.seriesDescription,
      orderIndex: membership.orderIndex,
      chapterLabel: membership.chapterLabel,
      totalPosts: seriesRows.length,
      previousPost,
      nextPost,
    }
  }

  return {
    id: post.id,
    type: post.type,
    slug: post.slug,
    title: post.title,
    summary: buildExcerpt(post.summary, post.contentMarkdown, 220),
    contentMarkdown: post.contentMarkdown,
    publishedAt:
      toIsoString(ensureDate(post.publishedAt)) ?? new Date(0).toISOString(),
    updatedAt: toIsoString(post.updatedAt) ?? new Date(0).toISOString(),
    readingMinutes: estimateReadingMinutes(post.contentMarkdown),
    tagNames: tagMap.get(post.id) ?? [],
    series,
    navigationMode,
    previousPost,
    nextPost,
  }
}

export async function listPublishedSeries(limit: number) {
  const rows = await db
    .select({
      seriesSlug: booklogSeries.slug,
      seriesTitle: booklogSeries.title,
      seriesDescription: booklogSeries.description,
      coverImageUrl: booklogSeries.coverImageUrl,
      postSlug: posts.slug,
      postTitle: posts.title,
      publishedAt: posts.publishedAt,
      orderIndex: booklogSeriesEntries.orderIndex,
      chapterLabel: booklogSeriesEntries.chapterLabel,
    })
    .from(booklogSeriesEntries)
    .innerJoin(
      booklogSeries,
      eq(booklogSeriesEntries.seriesId, booklogSeries.id),
    )
    .innerJoin(posts, eq(booklogSeriesEntries.postId, posts.id))
    .where(
      and(
        eq(posts.type, "BOOKLOG"),
        eq(posts.status, "PUBLISHED"),
        isNotNull(posts.publishedAt),
      ),
    )
    .orderBy(asc(booklogSeries.title), asc(booklogSeriesEntries.orderIndex))

  const bySeries = new Map<string, BooklogSeriesSummary>()

  for (const row of rows) {
    const existing = bySeries.get(row.seriesSlug)
    const latestPublishedAt = toIsoString(ensureDate(row.publishedAt))

    if (!existing) {
      bySeries.set(row.seriesSlug, {
        slug: row.seriesSlug,
        title: row.seriesTitle,
        description: row.seriesDescription,
        coverImageUrl: row.coverImageUrl,
        postCount: 1,
        latestPublishedAt,
        previewPosts: [
          {
            slug: row.postSlug,
            title: row.postTitle,
            orderIndex: row.orderIndex,
            chapterLabel: row.chapterLabel,
          },
        ],
      })
      continue
    }

    existing.postCount += 1
    if (
      latestPublishedAt &&
      (!existing.latestPublishedAt ||
        latestPublishedAt > existing.latestPublishedAt)
    ) {
      existing.latestPublishedAt = latestPublishedAt
    }

    existing.previewPosts.push({
      slug: row.postSlug,
      title: row.postTitle,
      orderIndex: row.orderIndex,
      chapterLabel: row.chapterLabel,
    })
  }

  return Array.from(bySeries.values())
    .map((series) => ({
      ...series,
      previewPosts: series.previewPosts
        .slice()
        .sort((left, right) => left.orderIndex - right.orderIndex)
        .slice(0, 3),
    }))
    .sort((left, right) => {
      if (left.latestPublishedAt && right.latestPublishedAt) {
        return right.latestPublishedAt.localeCompare(left.latestPublishedAt)
      }
      if (left.latestPublishedAt) {
        return -1
      }
      if (right.latestPublishedAt) {
        return 1
      }
      return left.title.localeCompare(right.title)
    })
    .slice(0, limit)
}

export async function getPublishedSeriesBySlug(
  seriesSlug: string,
): Promise<BooklogSeriesDetail | null> {
  const rows = await db
    .select({
      seriesSlug: booklogSeries.slug,
      seriesTitle: booklogSeries.title,
      seriesDescription: booklogSeries.description,
      coverImageUrl: booklogSeries.coverImageUrl,
      postId: posts.id,
      postSlug: posts.slug,
      postTitle: posts.title,
      postSummary: posts.summary,
      contentMarkdown: posts.contentMarkdown,
      publishedAt: posts.publishedAt,
      orderIndex: booklogSeriesEntries.orderIndex,
      chapterLabel: booklogSeriesEntries.chapterLabel,
    })
    .from(booklogSeriesEntries)
    .innerJoin(
      booklogSeries,
      eq(booklogSeriesEntries.seriesId, booklogSeries.id),
    )
    .innerJoin(posts, eq(booklogSeriesEntries.postId, posts.id))
    .where(
      and(
        eq(booklogSeries.slug, seriesSlug),
        eq(posts.type, "BOOKLOG"),
        eq(posts.status, "PUBLISHED"),
        isNotNull(posts.publishedAt),
      ),
    )
    .orderBy(asc(booklogSeriesEntries.orderIndex), desc(posts.publishedAt))

  if (rows.length === 0) {
    return null
  }

  const tagMap = await getTagNamesByPostIds(rows.map((row) => row.postId))
  const latestPublishedAt = rows.reduce<string | null>((latest, row) => {
    const current = toIsoString(ensureDate(row.publishedAt))
    if (!current) {
      return latest
    }
    if (!latest || current > latest) {
      return current
    }
    return latest
  }, null)

  return {
    slug: rows[0].seriesSlug,
    title: rows[0].seriesTitle,
    description: rows[0].seriesDescription,
    coverImageUrl: rows[0].coverImageUrl,
    postCount: rows.length,
    latestPublishedAt,
    posts: rows.map((row) => ({
      slug: row.postSlug,
      title: row.postTitle,
      summary: buildExcerpt(row.postSummary, row.contentMarkdown),
      publishedAt:
        toIsoString(ensureDate(row.publishedAt)) ?? new Date(0).toISOString(),
      readingMinutes: estimateReadingMinutes(row.contentMarkdown),
      orderIndex: row.orderIndex,
      chapterLabel: row.chapterLabel,
      tagNames: tagMap.get(row.postId) ?? [],
    })),
  }
}

export async function getPublishedPostsByTagName(tagName: string) {
  const normalizedTag = decodeURIComponent(tagName).trim().toLowerCase()

  const rows = await db
    .select({
      tagName: tags.name,
      id: posts.id,
      type: posts.type,
      slug: posts.slug,
      title: posts.title,
      summary: posts.summary,
      contentMarkdown: posts.contentMarkdown,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(tags)
    .innerJoin(postTags, eq(postTags.tagId, tags.id))
    .innerJoin(posts, eq(postTags.postId, posts.id))
    .where(
      and(
        sql<boolean>`lower(${tags.name}) = ${normalizedTag}`,
        eq(posts.status, "PUBLISHED"),
        isNotNull(posts.publishedAt),
      ),
    )
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt))

  if (rows.length === 0) {
    return null
  }

  const summaries = await hydratePostSummaries(
    rows.map((row) => ({
      id: row.id,
      type: row.type,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      contentMarkdown: row.contentMarkdown,
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })),
  )

  return {
    tagName: rows[0].tagName,
    posts: summaries,
  }
}
