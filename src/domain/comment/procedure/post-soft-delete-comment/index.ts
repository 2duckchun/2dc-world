import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { postComments } from "@/core/db/schema"
import { authProcedure } from "@/core/trpc/base/procedures/auth-procedure"
import {
  commentSoftDeleteInputSchema,
  commentSoftDeleteOutputSchema,
} from "./schema"

export const commentSoftDeleteProcedure = authProcedure
  .input(commentSoftDeleteInputSchema)
  .output(commentSoftDeleteOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const viewer = ctx.session?.user

    if (!viewer?.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "로그인이 필요합니다.",
      })
    }

    const existing = await ctx.db.query.postComments.findFirst({
      columns: { id: true, authorId: true, isDeleted: true },
      where: eq(postComments.id, input.commentId),
    })

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "댓글을 찾을 수 없습니다.",
      })
    }

    if (existing.isDeleted) {
      return { id: existing.id }
    }

    const isOwner = existing.authorId === viewer.id
    const isAdmin = viewer.role === "admin"

    if (!isOwner && !isAdmin) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "권한이 없습니다.",
      })
    }

    await ctx.db
      .update(postComments)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(postComments.id, input.commentId))

    return { id: existing.id }
  })
