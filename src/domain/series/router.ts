import { createTRPCRouter } from "@/core/trpc/base/init"
import { seriesListProcedure } from "./procedure/get-list"
import { seriesGetOptionsProcedure } from "./procedure/get-options"
import { seriesCreateProcedure } from "./procedure/post-create-series"
import { seriesUpdateProcedure } from "./procedure/post-update-series"

export const seriesRouter = createTRPCRouter({
  getOptions: seriesGetOptionsProcedure,
  list: seriesListProcedure,
  create: seriesCreateProcedure,
  update: seriesUpdateProcedure,
})
