import { ownerProcedure } from "@/core/trpc/init"
import { getEditablePost } from "@/domain/blog/lib/authoring"
import {
  getEditablePostInputSchema,
  getEditablePostOutputSchema,
} from "./schema"

export const getEditablePostProcedure = ownerProcedure
  .input(getEditablePostInputSchema)
  .output(getEditablePostOutputSchema)
  .query(({ ctx, input }) =>
    getEditablePost({
      userId: ctx.session.user?.id,
      type: input.type,
      slug: input.slug,
    }),
  )
