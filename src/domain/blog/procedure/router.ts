import { createTRPCRouter } from "@/core/trpc/init"
import { getBySlugProcedure } from "./get_by_slug"
import { getByTagProcedure } from "./get_by_tag"
import { getListPublishedProcedure } from "./get_list_published"
import { getSeriesBySlugProcedure } from "./get_series_by_slug"
import { getSeriesListProcedure } from "./get_series_list"

export const blogRouter = createTRPCRouter({
  getBySlug: getBySlugProcedure,
  getByTag: getByTagProcedure,
  getListPublished: getListPublishedProcedure,
  getSeriesBySlug: getSeriesBySlugProcedure,
  getSeriesList: getSeriesListProcedure,
})
