import { asc, eq } from "drizzle-orm"
import { posts, series } from "@/core/db/schema"
import { adminProcedure } from "@/core/trpc/base/procedures/admin-procedure"
import {
  seriesGetOptionsInputSchema,
  seriesGetOptionsOutputSchema,
} from "./schema"

export const seriesGetOptionsProcedure = adminProcedure
  .input(seriesGetOptionsInputSchema)
  .output(seriesGetOptionsOutputSchema)
  .query(async ({ ctx }) => {
    const seriesRows = await ctx.db.query.series.findMany({
      columns: {
        id: true,
        title: true,
      },
      with: {
        posts: {
          columns: {
            seriesOrder: true,
          },
          where: eq(posts.kind, "series"),
        },
      },
      orderBy: [asc(series.title)],
    })

    return seriesRows.map(({ posts: seriesPosts, ...seriesRow }) => {
      const maxOrder = seriesPosts.reduce(
        (max, { seriesOrder }) => Math.max(max, seriesOrder ?? 0),
        0,
      )

      return { ...seriesRow, nextOrder: maxOrder + 1 }
    })
  })
