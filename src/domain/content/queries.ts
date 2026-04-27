import "server-only"

import { and, desc, eq } from "drizzle-orm"
import { db } from "@/core/db"
import { posts } from "@/core/db/schema"
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

const getPublishedArchiveByKind = async (kind: PostKind) =>
  db.query.posts.findMany({
    columns: publishedArchiveColumns,
    where: and(eq(posts.status, "published"), eq(posts.kind, kind)),
    orderBy: getPublishedArchiveOrderBy(),
    with: {
      postTags: {
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
      },
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
