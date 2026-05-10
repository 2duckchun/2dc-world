import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { postComments } from "@/core/db/schema"
import { authProcedure } from "@/core/trpc/base/procedures/auth-procedure"
import { commentUpdateInputSchema, commentUpdateOutputSchema } from "./schema"

export const commentUpdateProcedure = authProcedure
  .input(commentUpdateInputSchema)
  .output(commentUpdateOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "로그인이 필요합니다.",
      })
    }

    const existing = await ctx.db.query.postComments.findFirst({
      columns: { id: true, authorId: true, isDeleted: true },
      where: eq(postComments.id, input.commentId),
    })

    if (!existing || existing.isDeleted) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "댓글을 찾을 수 없습니다.",
      })
    }

    if (existing.authorId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "본인 댓글만 수정할 수 있습니다.",
      })
    }

    await ctx.db
      .update(postComments)
      .set({ body: input.body, updatedAt: new Date() })
      .where(eq(postComments.id, input.commentId))

    return { id: existing.id }
  })
