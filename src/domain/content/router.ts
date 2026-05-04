import { createTRPCRouter } from "@/core/trpc/base/init"
import { contentGetHomeContentProcedure } from "./procedure/get-home-content"
import { contentGetLogArchiveProcedure } from "./procedure/get-log-archive"
import { contentGetPostArchiveProcedure } from "./procedure/get-post-archive"
import { contentGetSeriesArchiveProcedure } from "./procedure/get-series-archive"

export const contentRouter = createTRPCRouter({
  getHomeContent: contentGetHomeContentProcedure,
  getLogArchive: contentGetLogArchiveProcedure,
  getPostArchive: contentGetPostArchiveProcedure,
  getSeriesArchive: contentGetSeriesArchiveProcedure,
})
