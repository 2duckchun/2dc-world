import { and, eq } from "drizzle-orm"
import { posts } from "@/core/db/schema"
import { publicProcedure } from "@/core/trpc/base/procedures/public-procedure"
import {
  contentGetSeriesPostDetailInputSchema,
  contentGetSeriesPostDetailOutputSchema,
} from "./schema"

const publishedSeriesPostDetailColumns = {
  title: true,
  slug: true,
  subtitle: true,
  thumbnail: true,
  content: true,
  publishedAt: true,
  createdAt: true,
} as const

const publishedSeriesPostSeriesRelation = {
  columns: {
    title: true,
    slug: true,
  },
} as const

export const contentGetSeriesPostDetailProcedure = publicProcedure
  .input(contentGetSeriesPostDetailInputSchema)
  .output(contentGetSeriesPostDetailOutputSchema)
  .query(async ({ ctx, input }) => {
    const post = await ctx.db.query.posts.findFirst({
      columns: publishedSeriesPostDetailColumns,
      where: and(
        eq(posts.slug, input.slug),
        eq(posts.status, "published"),
        eq(posts.kind, "series"),
      ),
      with: {
        series: publishedSeriesPostSeriesRelation,
      },
    })

    if (!post?.series || post.series.slug !== input.seriesSlug) {
      return null
    }

    return post
  })
