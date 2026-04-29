import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { series } from "@/core/db/schema"
import { adminProcedure } from "@/core/trpc/base/procedures/admin-procedure"
import { seriesCreateInputSchema, seriesCreateOutputSchema } from "./schema"

export const seriesCreateProcedure = adminProcedure
  .input(seriesCreateInputSchema)
  .output(seriesCreateOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const existingSeries = await ctx.db.query.series.findFirst({
      columns: { id: true },
      where: eq(series.slug, input.slug),
    })

    if (existingSeries) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "이미 사용 중인 시리즈 슬러그입니다.",
      })
    }

    try {
      const [createdSeries] = await ctx.db
        .insert(series)
        .values({
          id: crypto.randomUUID(),
          title: input.title,
          slug: input.slug,
          description: input.description || null,
          thumbnail: input.thumbnail || null,
          updatedAt: new Date(),
        })
        .returning({
          id: series.id,
          slug: series.slug,
        })

      if (!createdSeries) {
        throw new Error("Series insert did not return a row")
      }

      return createdSeries
    } catch {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "시리즈 저장에 실패했습니다. 입력값을 다시 확인해 주세요.",
      })
    }
  })
