import { ownerProcedure } from "@/core/trpc/init"
import { updateDraft } from "@/domain/blog/lib/authoring"
import {
  postUpdateDraftInputSchema,
  postUpdateDraftOutputSchema,
} from "./schema"

export const postUpdateDraftProcedure = ownerProcedure
  .input(postUpdateDraftInputSchema)
  .output(postUpdateDraftOutputSchema)
  .mutation(({ ctx, input }) =>
    updateDraft({
      userId: ctx.session.user?.id,
      ...input,
    }),
  )
