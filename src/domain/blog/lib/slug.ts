import { and, eq } from "drizzle-orm"
import { db } from "@/core/db"
import { booklogSeries, posts } from "@/core/db/schema/blog"
import type { PostType } from "./model"

function slugify(value: string) {
  return value
    .normalize("NFC")
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function normalizeRequestedSlug(value: string) {
  return slugify(value)
}

export function normalizeStoredSlug(value: string) {
  return value.normalize("NFC")
}

export async function resolveUniquePostSlug(input: {
  type: PostType
  title: string
  requestedSlug?: string | null
  excludePostId?: string
}) {
  const baseSlug = slugify(input.requestedSlug ?? input.title) || "post"

  let candidate = baseSlug
  let suffix = 1

  while (true) {
    const existing = await db.query.posts.findFirst({
      where: and(eq(posts.type, input.type), eq(posts.slug, candidate)),
    })

    if (!existing || existing.id === input.excludePostId) {
      return candidate
    }

    suffix += 1
    candidate = `${baseSlug}-${suffix}`
  }
}

export async function resolveUniqueSeriesSlug(input: {
  title: string
  requestedSlug?: string | null
  excludeSeriesId?: string
}) {
  const baseSlug = slugify(input.requestedSlug ?? input.title) || "series"

  let candidate = baseSlug
  let suffix = 1

  while (true) {
    const existing = await db.query.booklogSeries.findFirst({
      where: eq(booklogSeries.slug, candidate),
    })

    if (!existing || existing.id === input.excludeSeriesId) {
      return candidate
    }

    suffix += 1
    candidate = `${baseSlug}-${suffix}`
  }
}
