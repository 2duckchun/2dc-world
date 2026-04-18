import { ownerProcedure } from "@/core/trpc/init"
import { listDraftPosts } from "@/domain/blog/lib/authoring"
import { getDraftListInputSchema, getDraftListOutputSchema } from "./schema"

export const getDraftListProcedure = ownerProcedure
  .input(getDraftListInputSchema)
  .output(getDraftListOutputSchema)
  .query(({ ctx, input }) =>
    listDraftPosts({
      userId: ctx.session.user?.id,
      type: input.type,
    }),
  )
