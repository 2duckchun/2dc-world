import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { posts, series } from "@/core/db/schema"
import { adminProcedure } from "@/core/trpc/base/procedures/admin-procedure"
import { seriesDeleteInputSchema, seriesDeleteOutputSchema } from "./schema"

export const seriesDeleteProcedure = adminProcedure
  .input(seriesDeleteInputSchema)
  .output(seriesDeleteOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const existingSeries = await ctx.db.query.series.findFirst({
      columns: { id: true },
      where: eq(series.id, input.id),
    })

    if (!existingSeries) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "삭제할 시리즈를 찾을 수 없습니다.",
      })
    }

    try {
      const [deletedPosts, deletedSeriesRows] = await ctx.db.batch([
        ctx.db
          .delete(posts)
          .where(eq(posts.seriesId, input.id))
          .returning({ id: posts.id }),
        ctx.db
          .delete(series)
          .where(eq(series.id, input.id))
          .returning({ id: series.id }),
      ])
      const [deletedSeries] = deletedSeriesRows

      if (!deletedSeries) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "삭제할 시리즈를 찾을 수 없습니다.",
        })
      }

      return {
        id: deletedSeries.id,
        deletedPostCount: deletedPosts.length,
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "시리즈 삭제에 실패했습니다. 다시 시도해 주세요.",
      })
    }
  })
