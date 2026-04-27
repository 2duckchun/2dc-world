import "server-only"

import { and, desc, eq } from "drizzle-orm"
import { db } from "@/core/db"
import { posts } from "@/core/db/schema"

export const getPublishedPostArchive = async () =>
  db.query.posts.findMany({
    columns: {
      id: true,
      title: true,
      slug: true,
      subtitle: true,
      publishedAt: true,
      createdAt: true,
    },
    where: and(eq(posts.status, "published"), eq(posts.kind, "post")),
    orderBy: [desc(posts.publishedAt), desc(posts.createdAt)],
  })

export const getPublishedPostBySlug = async (slug: string) =>
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
    where: and(eq(posts.slug, slug), eq(posts.status, "published")),
    with: {
      series: {
        columns: {
          title: true,
          slug: true,
        },
      },
    },
  })
