import { publicProcedure } from "@/core/trpc/init"
import { listPublishedSeries } from "@/domain/blog/procedure/read-model"
import { getSeriesListInputSchema, getSeriesListOutputSchema } from "./schema"

export const getSeriesListProcedure = publicProcedure
  .input(getSeriesListInputSchema)
  .output(getSeriesListOutputSchema)
  .query(({ input }) => listPublishedSeries(input.limit))
