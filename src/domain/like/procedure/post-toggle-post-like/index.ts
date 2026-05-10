import { TRPCError } from "@trpc/server"
import { and, count, eq } from "drizzle-orm"
import { postLikes, posts } from "@/core/db/schema"
import { authProcedure } from "@/core/trpc/base/procedures/auth-procedure"
import {
  likeTogglePostLikeInputSchema,
  likeTogglePostLikeOutputSchema,
} from "./schema"

export const likeTogglePostLikeProcedure = authProcedure
  .input(likeTogglePostLikeInputSchema)
  .output(likeTogglePostLikeOutputSchema)
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

    const inserted = await ctx.db
      .insert(postLikes)
      .values({ postId: input.postId, userId })
      .onConflictDoNothing()
      .returning({ postId: postLikes.postId })

    let liked: boolean

    if (inserted.length > 0) {
      liked = true
    } else {
      await ctx.db
        .delete(postLikes)
        .where(
          and(eq(postLikes.postId, input.postId), eq(postLikes.userId, userId)),
        )
      liked = false
    }

    const [countRow] = await ctx.db
      .select({ count: count() })
      .from(postLikes)
      .where(eq(postLikes.postId, input.postId))

    return {
      liked,
      likeCount: countRow?.count ?? 0,
    }
  })
