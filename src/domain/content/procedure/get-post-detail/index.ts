import { and, eq } from "drizzle-orm"
import { posts } from "@/core/db/schema"
import { publicProcedure } from "@/core/trpc/base/procedures/public-procedure"
import {
  contentGetPostDetailInputSchema,
  contentGetPostDetailOutputSchema,
} from "./schema"

const publishedPostDetailColumns = {
  title: true,
  slug: true,
  subtitle: true,
  thumbnail: true,
  content: true,
  publishedAt: true,
  createdAt: true,
} as const

const publishedPostSeriesRelation = {
  columns: {
    title: true,
    slug: true,
  },
} as const

export const contentGetPostDetailProcedure = publicProcedure
  .input(contentGetPostDetailInputSchema)
  .output(contentGetPostDetailOutputSchema)
  .query(async ({ ctx, input }) => {
    const post = await ctx.db.query.posts.findFirst({
      columns: publishedPostDetailColumns,
      where: and(
        eq(posts.slug, input.slug),
        eq(posts.status, "published"),
        eq(posts.kind, "post"),
      ),
      with: {
        series: publishedPostSeriesRelation,
      },
    })

    return post ?? null
  })
