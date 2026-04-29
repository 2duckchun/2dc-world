import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { posts } from "@/core/db/schema"
import { adminProcedure } from "@/core/trpc/base/procedures/admin-procedure"
import {
  postArchivePostInputSchema,
  postArchivePostOutputSchema,
} from "./schema"

export const postArchivePostProcedure = adminProcedure
  .input(postArchivePostInputSchema)
  .output(postArchivePostOutputSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const [archivedPost] = await ctx.db
        .update(posts)
        .set({
          status: "archived",
          updatedAt: new Date(),
        })
        .where(eq(posts.id, input.id))
        .returning({
          id: posts.id,
          status: posts.status,
        })

      if (!archivedPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "삭제할 게시글을 찾을 수 없습니다.",
        })
      }

      return {
        id: archivedPost.id,
        status: "archived" as const,
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "게시글 삭제에 실패했습니다. 다시 시도해 주세요.",
      })
    }
  })
