import { and, asc, eq } from "drizzle-orm"
import { posts, series } from "@/core/db/schema"
import { publicProcedure } from "@/core/trpc/base/procedures/public-procedure"
import {
  contentGetSeriesArchiveInputSchema,
  contentGetSeriesArchiveOutputSchema,
} from "./schema"

const publishedSeriesPostColumns = {
  id: true,
  title: true,
  slug: true,
  subtitle: true,
  publishedAt: true,
  createdAt: true,
  seriesOrder: true,
} as const

const getPublishedSeriesPostOrderBy = () => [
  asc(posts.seriesOrder),
  asc(posts.publishedAt),
  asc(posts.createdAt),
]

export const contentGetSeriesArchiveProcedure = publicProcedure
  .input(contentGetSeriesArchiveInputSchema)
  .output(contentGetSeriesArchiveOutputSchema)
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
          columns: publishedSeriesPostColumns,
          where: and(eq(posts.status, "published"), eq(posts.kind, "series")),
          orderBy: getPublishedSeriesPostOrderBy(),
        },
      },
      orderBy: [asc(series.title)],
    })

    return seriesRows.filter((seriesRow) => seriesRow.posts.length > 0)
  })
