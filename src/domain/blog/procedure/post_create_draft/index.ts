import { ownerProcedure } from "@/core/trpc/init"
import { createDraft } from "@/domain/blog/lib/authoring"
import {
  postCreateDraftInputSchema,
  postCreateDraftOutputSchema,
} from "./schema"

export const postCreateDraftProcedure = ownerProcedure
  .input(postCreateDraftInputSchema)
  .output(postCreateDraftOutputSchema)
  .mutation(({ ctx, input }) =>
    createDraft({
      userId: ctx.session.user?.id,
      ...input,
    }),
  )
