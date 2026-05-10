import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import { postComments, posts } from "@/core/db/schema"
import { authProcedure } from "@/core/trpc/base/procedures/auth-procedure"
import { commentCreateInputSchema, commentCreateOutputSchema } from "./schema"

export const commentCreateProcedure = authProcedure
  .input(commentCreateInputSchema)
  .output(commentCreateOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "로그인이 필요합니다.",
      })
    }

    const post = await ctx.db.query.posts.findFirst({
      columns: { id: true },
      where: and(eq(posts.id, input.postId), eq(posts.status, "published")),
    })

    if (!post) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "게시글을 찾을 수 없습니다.",
      })
    }

    if (input.parentCommentId !== null) {
      const parent = await ctx.db.query.postComments.findFirst({
        columns: {
          id: true,
          postId: true,
          parentCommentId: true,
          isDeleted: true,
        },
        where: eq(postComments.id, input.parentCommentId),
      })

      if (!parent) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "답글을 달 댓글을 찾을 수 없습니다.",
        })
      }

      if (parent.postId !== input.postId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "다른 게시글의 댓글에는 답글을 달 수 없습니다.",
        })
      }

      if (parent.parentCommentId !== null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "대댓글에는 답글을 달 수 없습니다.",
        })
      }

      if (parent.isDeleted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "삭제된 댓글에는 답글을 달 수 없습니다.",
        })
      }
    }

    const [inserted] = await ctx.db
      .insert(postComments)
      .values({
        postId: input.postId,
        authorId: userId,
        parentCommentId: input.parentCommentId,
        body: input.body,
      })
      .returning({ id: postComments.id })

    if (!inserted) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "댓글 저장에 실패했습니다.",
      })
    }

    return { id: inserted.id }
  })
