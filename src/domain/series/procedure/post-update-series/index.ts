import { TRPCError } from "@trpc/server"
import { and, eq, ne } from "drizzle-orm"
import { series } from "@/core/db/schema"
import { adminProcedure } from "@/core/trpc/base/procedures/admin-procedure"
import { seriesUpdateInputSchema, seriesUpdateOutputSchema } from "./schema"

export const seriesUpdateProcedure = adminProcedure
  .input(seriesUpdateInputSchema)
  .output(seriesUpdateOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const existingSeries = await ctx.db.query.series.findFirst({
      columns: { id: true },
      where: eq(series.id, input.id),
    })

    if (!existingSeries) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "수정할 시리즈를 찾을 수 없습니다.",
      })
    }

    const slugOwner = await ctx.db.query.series.findFirst({
      columns: { id: true },
      where: and(eq(series.slug, input.slug), ne(series.id, input.id)),
    })

    if (slugOwner) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "이미 사용 중인 시리즈 슬러그입니다.",
      })
    }

    try {
      const [updatedSeries] = await ctx.db
        .update(series)
        .set({
          title: input.title,
          slug: input.slug,
          description: input.description || null,
          thumbnail: input.thumbnail || null,
          updatedAt: new Date(),
        })
        .where(eq(series.id, input.id))
        .returning({
          id: series.id,
          slug: series.slug,
        })

      if (!updatedSeries) {
        throw new Error("Series update did not return a row")
      }

      return updatedSeries
    } catch {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "시리즈 수정에 실패했습니다. 입력값을 다시 확인해 주세요.",
      })
    }
  })
