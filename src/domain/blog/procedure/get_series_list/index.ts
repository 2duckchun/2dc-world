import { publicProcedure } from "@/core/trpc/init"
import { listBooklogSeries } from "@/domain/blog/lib/repository"
import { getSeriesListOutputSchema } from "./schema"

export const getSeriesListProcedure = publicProcedure
  .output(getSeriesListOutputSchema)
  .query(() => listBooklogSeries())
