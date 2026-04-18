import { ownerProcedure } from "@/core/trpc/init"
import { publishPost } from "@/domain/blog/lib/authoring"
import { postPublishInputSchema, postPublishOutputSchema } from "./schema"

export const postPublishProcedure = ownerProcedure
  .input(postPublishInputSchema)
  .output(postPublishOutputSchema)
  .mutation(({ ctx, input }) =>
    publishPost({
      userId: ctx.session.user?.id,
      postId: input.postId,
    }),
  )
