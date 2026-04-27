import { TRPCError } from "@trpc/server"
import { eq, inArray, sql } from "drizzle-orm"
import { posts, postTags, series, tags } from "@/core/db/schema"
import { adminProcedure } from "@/core/trpc/base/procedures/admin-procedure"
import { normalizeTagInputs } from "@/domain/content/tags"
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
      const postId = crypto.randomUUID()
      const normalizedTags = normalizeTagInputs(input.tags)
      const createdPostQuery = ctx.db
        .insert(posts)
        .values({
          id: postId,
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
      let createdPostRows: Array<{ id: string; slug: string }>

      if (normalizedTags.length > 0) {
        const [, postRows] = await ctx.db.batch([
          ctx.db
            .insert(tags)
            .values(normalizedTags)
            .onConflictDoUpdate({
              target: tags.slug,
              set: { name: sql`${tags.name}` },
            }),
          createdPostQuery,
          ctx.db
            .insert(postTags)
            .select(
              ctx.db
                .select({
                  postId: sql<string>`${postId}`.as("post_id"),
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
            .onConflictDoNothing(),
        ])

        createdPostRows = postRows
      } else {
        const [postRows] = await ctx.db.batch([createdPostQuery])

        createdPostRows = postRows
      }

      const [createdPost] = createdPostRows

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
