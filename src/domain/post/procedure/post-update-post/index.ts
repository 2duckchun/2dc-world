import { TRPCError } from "@trpc/server"
import { and, eq, inArray, ne, sql } from "drizzle-orm"
import { posts, postTags, series, tags } from "@/core/db/schema"
import { adminProcedure } from "@/core/trpc/base/procedures/admin-procedure"
import { normalizeTagInputs } from "@/domain/content/tags"
import { postUpdatePostInputSchema, postUpdatePostOutputSchema } from "./schema"

const getSeriesValues = (input: {
  kind: string
  seriesId: string | null
  seriesOrder: number | null
}) =>
  input.kind === "series"
    ? {
        seriesId: input.seriesId || null,
        seriesOrder: input.seriesOrder,
      }
    : {
        seriesId: null,
        seriesOrder: null,
      }

export const postUpdatePostProcedure = adminProcedure
  .input(postUpdatePostInputSchema)
  .output(postUpdatePostOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const existingPost = await ctx.db.query.posts.findFirst({
      columns: {
        id: true,
        publishedAt: true,
      },
      where: eq(posts.id, input.id),
    })

    if (!existingPost) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "수정할 게시글을 찾을 수 없습니다.",
      })
    }

    const slugOwner = await ctx.db.query.posts.findFirst({
      columns: { id: true },
      where: and(eq(posts.slug, input.slug), ne(posts.id, input.id)),
    })

    if (slugOwner) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "이미 사용 중인 슬러그입니다.",
      })
    }

    const { seriesId, seriesOrder } = getSeriesValues(input)

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

      if (seriesOrder !== null) {
        const orderOwner = await ctx.db.query.posts.findFirst({
          columns: { id: true },
          where: and(
            eq(posts.seriesId, seriesId),
            eq(posts.seriesOrder, seriesOrder),
            ne(posts.id, input.id),
          ),
        })

        if (orderOwner) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "이미 사용 중인 시리즈 순서입니다.",
          })
        }
      }
    }

    try {
      const updatedAt = new Date()
      const normalizedTags = normalizeTagInputs(input.tags)
      const [updatedPost] = await ctx.db
        .update(posts)
        .set({
          title: input.title,
          slug: input.slug,
          subtitle: input.subtitle || null,
          thumbnail: input.thumbnail || null,
          content: input.content,
          kind: input.kind,
          status: input.status,
          seriesId,
          seriesOrder,
          publishedAt:
            input.status === "published"
              ? (existingPost.publishedAt ?? updatedAt)
              : existingPost.publishedAt,
          updatedAt,
        })
        .where(eq(posts.id, input.id))
        .returning({
          id: posts.id,
          slug: posts.slug,
        })

      if (!updatedPost) {
        throw new Error("Post update did not return a row")
      }

      await ctx.db.delete(postTags).where(eq(postTags.postId, input.id))

      if (normalizedTags.length > 0) {
        await ctx.db
          .insert(tags)
          .values(normalizedTags)
          .onConflictDoUpdate({
            target: tags.slug,
            set: { name: sql`${tags.name}` },
          })

        await ctx.db
          .insert(postTags)
          .select(
            ctx.db
              .select({
                postId: sql<string>`${input.id}`.as("post_id"),
                tagId: tags.id,
              })
              .from(tags)
              .where(
                inArray(
                  tags.slug,
                  normalizedTags.map((tag) => tag.slug),
                ),
              ),
          )
          .onConflictDoNothing()
      }

      return updatedPost
    } catch {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "게시글 수정에 실패했습니다. 입력값을 다시 확인해 주세요.",
      })
    }
  })
