import { TRPCError } from "@trpc/server"
import { publicProcedure } from "@/core/trpc/init"
import { getSeriesBySlug } from "@/domain/blog/lib/repository"
import {
  getSeriesBySlugInputSchema,
  getSeriesBySlugOutputSchema,
} from "./schema"

export const getSeriesBySlugProcedure = publicProcedure
  .input(getSeriesBySlugInputSchema)
  .output(getSeriesBySlugOutputSchema)
  .query(async ({ input }) => {
    const series = await getSeriesBySlug(input.seriesSlug)

    if (!series) {
      throw new TRPCError({ code: "NOT_FOUND" })
    }

    return series
  })
