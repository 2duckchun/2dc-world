import { ownerProcedure } from "@/core/trpc/init"
import { createSeries } from "@/domain/blog/lib/authoring"
import {
  postCreateSeriesInputSchema,
  postCreateSeriesOutputSchema,
} from "./schema"

export const postCreateSeriesProcedure = ownerProcedure
  .input(postCreateSeriesInputSchema)
  .output(postCreateSeriesOutputSchema)
  .mutation(({ ctx, input }) =>
    createSeries({
      userId: ctx.session.user?.id,
      ...input,
    }),
  )
