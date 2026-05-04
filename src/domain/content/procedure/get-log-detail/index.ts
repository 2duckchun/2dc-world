import { and, eq } from "drizzle-orm"
import { posts } from "@/core/db/schema"
import { publicProcedure } from "@/core/trpc/base/procedures/public-procedure"
import {
  contentGetLogDetailInputSchema,
  contentGetLogDetailOutputSchema,
} from "./schema"

const publishedLogDetailColumns = {
  title: true,
  slug: true,
  subtitle: true,
  thumbnail: true,
  content: true,
  publishedAt: true,
  createdAt: true,
} as const

const publishedLogSeriesRelation = {
  columns: {
    title: true,
    slug: true,
  },
} as const

export const contentGetLogDetailProcedure = publicProcedure
  .input(contentGetLogDetailInputSchema)
  .output(contentGetLogDetailOutputSchema)
  .query(async ({ ctx, input }) => {
    const post = await ctx.db.query.posts.findFirst({
      columns: publishedLogDetailColumns,
      where: and(
        eq(posts.slug, input.slug),
        eq(posts.status, "published"),
        eq(posts.kind, "log"),
      ),
      with: {
        series: publishedLogSeriesRelation,
      },
    })

    return post ?? null
  })
