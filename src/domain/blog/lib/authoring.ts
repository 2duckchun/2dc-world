import { TRPCError } from "@trpc/server"
import { and, desc, eq, inArray } from "drizzle-orm"
import { db } from "@/core/db"
import {
  booklogSeries,
  booklogSeriesEntries,
  posts,
  postTags,
  tags,
} from "@/core/db/schema/blog"
import type {
  AuthoringSeries,
  DraftListItem,
  EditablePost,
  PostType,
  SyncTagsResult,
} from "./model"
import { resolveUniquePostSlug, resolveUniqueSeriesSlug } from "./slug"
import { normalizeTagNames } from "./tags"

function toIsoString(value: Date | null) {
  return value ? value.toISOString() : null
}

function ensureOwnerUserId(userId: string | undefined) {
  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return userId
}

async function getTagNamesByPostId(postId: string) {
  const rows = await db
    .select({ name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, postId))

  return rows.map((row) => row.name).sort((a, b) => a.localeCompare(b))
}

async function getSeriesSelectionByPostId(postId: string) {
  const row = await db
    .select({
      seriesId: booklogSeries.id,
      title: booklogSeries.title,
      slug: booklogSeries.slug,
      coverImageUrl: booklogSeries.coverImageUrl,
      orderIndex: booklogSeriesEntries.orderIndex,
      chapterLabel: booklogSeriesEntries.chapterLabel,
    })
    .from(booklogSeriesEntries)
    .innerJoin(
      booklogSeries,
      eq(booklogSeriesEntries.seriesId, booklogSeries.id),
    )
    .where(eq(booklogSeriesEntries.postId, postId))
    .then((rows) => rows[0] ?? null)

  return row
}

async function toEditablePost(postId: string) {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
  })

  if (!post) {
    throw new TRPCError({ code: "NOT_FOUND" })
  }

  const [tagNames, series] = await Promise.all([
    getTagNamesByPostId(post.id),
    getSeriesSelectionByPostId(post.id),
  ])

  return {
    id: post.id,
    type: post.type,
    status: post.status,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    contentMarkdown: post.contentMarkdown,
    publishedAt: toIsoString(post.publishedAt),
    updatedAt: post.updatedAt.toISOString(),
    tagNames,
    series,
  } satisfies EditablePost
}

async function syncTags(postId: string, tagNames: string[]) {
  const normalizedTagNames = normalizeTagNames(tagNames)

  await db.delete(postTags).where(eq(postTags.postId, postId))

  if (normalizedTagNames.length === 0) {
    return {
      postId,
      tagNames: normalizedTagNames,
    } satisfies SyncTagsResult
  }

  await db
    .insert(tags)
    .values(normalizedTagNames.map((name) => ({ name })))
    .onConflictDoNothing({ target: tags.name })

  const tagRows = await db
    .select({ id: tags.id, name: tags.name })
    .from(tags)
    .where(inArray(tags.name, normalizedTagNames))

  if (tagRows.length > 0) {
    await db.insert(postTags).values(
      tagRows.map((tag) => ({
        postId,
        tagId: tag.id,
      })),
    )
  }

  return {
    postId,
    tagNames: normalizedTagNames,
  } satisfies SyncTagsResult
}

async function syncBooklogSeriesEntry(input: {
  postId: string
  type: PostType
  series: {
    seriesId: string
    orderIndex: number
    chapterLabel?: string | null
  } | null
}) {
  await db
    .delete(booklogSeriesEntries)
    .where(eq(booklogSeriesEntries.postId, input.postId))

  if (input.type !== "BOOKLOG" || !input.series) {
    return null
  }

  const existingSeries = await db.query.booklogSeries.findFirst({
    where: eq(booklogSeries.id, input.series.seriesId),
  })

  if (!existingSeries) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Series not found." })
  }

  await db.insert(booklogSeriesEntries).values({
    postId: input.postId,
    seriesId: input.series.seriesId,
    orderIndex: input.series.orderIndex,
    chapterLabel: input.series.chapterLabel ?? null,
  })

  return getSeriesSelectionByPostId(input.postId)
}

export async function listDraftPosts(input: {
  userId: string | undefined
  type?: PostType
}) {
  const ownerId = ensureOwnerUserId(input.userId)
  const conditions = [
    eq(posts.authorId, ownerId),
    eq(posts.status, "DRAFT"),
  ] as const

  const rows = await db
    .select()
    .from(posts)
    .where(
      input.type
        ? and(
            eq(posts.authorId, ownerId),
            eq(posts.status, "DRAFT"),
            eq(posts.type, input.type),
          )
        : and(...conditions),
    )
    .orderBy(desc(posts.updatedAt))

  return rows.map(
    (post) =>
      ({
        id: post.id,
        type: post.type,
        status: post.status,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        updatedAt: post.updatedAt.toISOString(),
        publishedAt: toIsoString(post.publishedAt),
      }) satisfies DraftListItem,
  )
}

export async function getEditablePost(input: {
  userId: string | undefined
  type: PostType
  slug: string
}) {
  ensureOwnerUserId(input.userId)

  const post = await db.query.posts.findFirst({
    where: and(eq(posts.type, input.type), eq(posts.slug, input.slug)),
  })

  if (!post) {
    throw new TRPCError({ code: "NOT_FOUND" })
  }

  return toEditablePost(post.id)
}

export async function createDraft(input: {
  userId: string | undefined
  type: PostType
  title: string
  slug?: string | null
  summary?: string | null
  contentMarkdown: string
  tagNames: string[]
  series: {
    seriesId: string
    orderIndex: number
    chapterLabel?: string | null
  } | null
}) {
  const ownerId = ensureOwnerUserId(input.userId)
  const slug = await resolveUniquePostSlug({
    type: input.type,
    title: input.title,
    requestedSlug: input.slug,
  })

  const [post] = await db
    .insert(posts)
    .values({
      authorId: ownerId,
      type: input.type,
      status: "DRAFT",
      title: input.title.trim(),
      slug,
      summary: input.summary?.trim() || null,
      contentMarkdown: input.contentMarkdown,
      updatedAt: new Date(),
    })
    .returning({ id: posts.id })

  await syncTags(post.id, input.tagNames)
  await syncBooklogSeriesEntry({
    postId: post.id,
    type: input.type,
    series: input.series,
  })

  return toEditablePost(post.id)
}

export async function updateDraft(input: {
  userId: string | undefined
  postId: string
  title: string
  slug?: string | null
  summary?: string | null
  contentMarkdown: string
  tagNames: string[]
  series: {
    seriesId: string
    orderIndex: number
    chapterLabel?: string | null
  } | null
}) {
  ensureOwnerUserId(input.userId)

  const existing = await db.query.posts.findFirst({
    where: eq(posts.id, input.postId),
  })

  if (!existing) {
    throw new TRPCError({ code: "NOT_FOUND" })
  }

  const slug = await resolveUniquePostSlug({
    type: existing.type,
    title: input.title,
    requestedSlug: input.slug,
    excludePostId: existing.id,
  })

  await db
    .update(posts)
    .set({
      title: input.title.trim(),
      slug,
      summary: input.summary?.trim() || null,
      contentMarkdown: input.contentMarkdown,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, existing.id))

  await syncTags(existing.id, input.tagNames)
  await syncBooklogSeriesEntry({
    postId: existing.id,
    type: existing.type,
    series: input.series,
  })

  return toEditablePost(existing.id)
}

export async function publishPost(input: {
  userId: string | undefined
  postId: string
}) {
  ensureOwnerUserId(input.userId)

  const existing = await db.query.posts.findFirst({
    where: eq(posts.id, input.postId),
  })

  if (!existing) {
    throw new TRPCError({ code: "NOT_FOUND" })
  }

  await db
    .update(posts)
    .set({
      status: "PUBLISHED",
      publishedAt: existing.publishedAt ?? new Date(),
      updatedAt: new Date(),
    })
    .where(eq(posts.id, existing.id))

  return toEditablePost(existing.id)
}

export async function createSeries(input: {
  userId: string | undefined
  title: string
  slug?: string | null
  description?: string | null
  coverImageUrl?: string | null
}) {
  ensureOwnerUserId(input.userId)

  const slug = await resolveUniqueSeriesSlug({
    title: input.title,
    requestedSlug: input.slug,
  })

  const [series] = await db
    .insert(booklogSeries)
    .values({
      title: input.title.trim(),
      slug,
      description: input.description?.trim() || null,
      coverImageUrl: input.coverImageUrl?.trim() || null,
      updatedAt: new Date(),
    })
    .returning()

  return {
    id: series.id,
    slug: series.slug,
    title: series.title,
    description: series.description,
    coverImageUrl: series.coverImageUrl,
    createdAt: series.createdAt.toISOString(),
    updatedAt: series.updatedAt.toISOString(),
  } satisfies AuthoringSeries
}

export async function syncTagsForPost(input: {
  userId: string | undefined
  postId: string
  tagNames: string[]
}) {
  ensureOwnerUserId(input.userId)

  const existing = await db.query.posts.findFirst({
    where: eq(posts.id, input.postId),
  })

  if (!existing) {
    throw new TRPCError({ code: "NOT_FOUND" })
  }

  await db
    .update(posts)
    .set({ updatedAt: new Date() })
    .where(eq(posts.id, existing.id))

  return syncTags(existing.id, input.tagNames)
}
