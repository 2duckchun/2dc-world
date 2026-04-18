import { ownerProcedure } from "@/core/trpc/init"
import { syncTagsForPost } from "@/domain/blog/lib/authoring"
import { postSyncTagsInputSchema, postSyncTagsOutputSchema } from "./schema"

export const postSyncTagsProcedure = ownerProcedure
  .input(postSyncTagsInputSchema)
  .output(postSyncTagsOutputSchema)
  .mutation(({ ctx, input }) =>
    syncTagsForPost({
      userId: ctx.session.user?.id,
      ...input,
    }),
  )
