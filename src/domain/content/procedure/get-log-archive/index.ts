import { and, desc, eq } from "drizzle-orm"
import { posts } from "@/core/db/schema"
import { publicProcedure } from "@/core/trpc/base/procedures/public-procedure"
import {
  contentGetLogArchiveInputSchema,
  contentGetLogArchiveOutputSchema,
} from "./schema"

const publishedLogArchiveColumns = {
  id: true,
  title: true,
  slug: true,
  subtitle: true,
  publishedAt: true,
  createdAt: true,
} as const

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

export const contentGetLogArchiveProcedure = publicProcedure
  .input(contentGetLogArchiveInputSchema)
  .output(contentGetLogArchiveOutputSchema)
  .query(async ({ ctx }) =>
    ctx.db.query.posts.findMany({
      columns: publishedLogArchiveColumns,
      where: and(eq(posts.status, "published"), eq(posts.kind, "log")),
      orderBy: [desc(posts.publishedAt), desc(posts.createdAt)],
      with: {
        postTags: publishedPostTagsRelation,
      },
    }),
  )
