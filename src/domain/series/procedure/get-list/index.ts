import { asc, eq } from "drizzle-orm"
import { posts, series } from "@/core/db/schema"
import { adminProcedure } from "@/core/trpc/base/procedures/admin-procedure"
import { seriesListInputSchema, seriesListOutputSchema } from "./schema"

export const seriesListProcedure = adminProcedure
  .input(seriesListInputSchema)
  .output(seriesListOutputSchema)
  .query(async ({ ctx }) => {
    const seriesRows = await ctx.db.query.series.findMany({
      columns: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        posts: {
          columns: {
            id: true,
          },
          where: eq(posts.kind, "series"),
        },
      },
      orderBy: [asc(series.title)],
    })

    return seriesRows.map(({ posts: seriesPosts, ...seriesRow }) => ({
      ...seriesRow,
      episodeCount: seriesPosts.length,
    }))
  })
