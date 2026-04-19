import { publicProcedure } from "@/core/trpc/init"
import { getPublishedSeriesBySlug } from "@/domain/blog/procedure/read-model"
import {
  getSeriesBySlugInputSchema,
  getSeriesBySlugOutputSchema,
} from "./schema"

export const getSeriesBySlugProcedure = publicProcedure
  .input(getSeriesBySlugInputSchema)
  .output(getSeriesBySlugOutputSchema)
  .query(({ input }) => getPublishedSeriesBySlug(input.seriesSlug))
