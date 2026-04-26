import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { posts, series } from "@/core/db/schema"
import { adminProcedure } from "@/core/trpc/base/procedures/admin-procedure"
import { postCreatePostInputSchema, postCreatePostOutputSchema } from "./schema"

export const postCreatePostProcedure = adminProcedure
  .input(postCreatePostInputSchema)
  .output(postCreatePostOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const authorId = ctx.session?.user?.id

    if (!authorId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "로그인이 필요합니다.",
      })
    }

    const seriesId = input.seriesId || null
    const seriesOrder = input.seriesOrder
    const existingPost = await ctx.db.query.posts.findFirst({
      columns: { id: true },
      where: eq(posts.slug, input.slug),
    })

    if (existingPost) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "이미 사용 중인 슬러그입니다.",
      })
    }

    if (seriesId) {
      const existingSeries = await ctx.db.query.series.findFirst({
        columns: { id: true },
        where: eq(series.id, seriesId),
      })

      if (!existingSeries) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "선택한 시리즈를 찾을 수 없습니다.",
        })
      }
    }

    try {
      const [createdPost] = await ctx.db
        .insert(posts)
        .values({
          title: input.title,
          slug: input.slug,
          subtitle: input.subtitle || null,
          thumbnail: input.thumbnail || null,
          content: input.content,
          kind: input.kind,
          status: input.status,
          authorId,
          seriesId,
          seriesOrder,
          publishedAt: input.status === "published" ? new Date() : null,
          updatedAt: new Date(),
        })
        .returning({
          id: posts.id,
          slug: posts.slug,
        })

      if (!createdPost) {
        throw new Error("Post insert did not return a row")
      }

      return createdPost
    } catch {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "게시글 저장에 실패했습니다. 입력값을 다시 확인해 주세요.",
      })
    }
  })
