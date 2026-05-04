import { and, desc, eq } from "drizzle-orm"
import { posts } from "@/core/db/schema"
import { publicProcedure } from "@/core/trpc/base/procedures/public-procedure"
import {
  contentGetPostArchiveInputSchema,
  contentGetPostArchiveOutputSchema,
} from "./schema"

const publishedPostArchiveColumns = {
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

export const contentGetPostArchiveProcedure = publicProcedure
  .input(contentGetPostArchiveInputSchema)
  .output(contentGetPostArchiveOutputSchema)
  .query(async ({ ctx }) =>
    ctx.db.query.posts.findMany({
      columns: publishedPostArchiveColumns,
      where: and(eq(posts.status, "published"), eq(posts.kind, "post")),
      orderBy: [desc(posts.publishedAt), desc(posts.createdAt)],
      with: {
        postTags: publishedPostTagsRelation,
      },
    }),
  )
