import { and, count, eq } from "drizzle-orm"
import { postLikes } from "@/core/db/schema"
import { publicProcedure } from "@/core/trpc/base/procedures/public-procedure"
import {
  likeGetPostStatsInputSchema,
  likeGetPostStatsOutputSchema,
} from "./schema"

export const likeGetPostStatsProcedure = publicProcedure
  .input(likeGetPostStatsInputSchema)
  .output(likeGetPostStatsOutputSchema)
  .query(async ({ ctx, input }) => {
    const viewerId = ctx.session?.user?.id ?? null

    const [countRows, likedRow] = await Promise.all([
      ctx.db
        .select({ count: count() })
        .from(postLikes)
        .where(eq(postLikes.postId, input.postId)),
      viewerId
        ? ctx.db.query.postLikes.findFirst({
            columns: { postId: true },
            where: and(
              eq(postLikes.postId, input.postId),
              eq(postLikes.userId, viewerId),
            ),
          })
        : Promise.resolve(undefined),
    ])

    return {
      likeCount: countRows[0]?.count ?? 0,
      likedByMe: Boolean(likedRow),
    }
  })
