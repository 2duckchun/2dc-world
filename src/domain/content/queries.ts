import "server-only"

import { and, eq } from "drizzle-orm"
import { db } from "@/core/db"
import { posts } from "@/core/db/schema"

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
