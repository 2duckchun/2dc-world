import { createTRPCRouter } from "@/core/trpc/init"
import { getBySlugProcedure } from "./get-by-slug"
import { getByTagProcedure } from "./get-by-tag"
import { getListPublishedProcedure } from "./get-list-published"
import { getSeriesBySlugProcedure } from "./get-series-by-slug"
import { getSeriesListProcedure } from "./get-series-list"

export const blogRouter = createTRPCRouter({
  getListPublished: getListPublishedProcedure,
  getBySlug: getBySlugProcedure,
  getSeriesList: getSeriesListProcedure,
  getSeriesBySlug: getSeriesBySlugProcedure,
  getByTag: getByTagProcedure,
})
