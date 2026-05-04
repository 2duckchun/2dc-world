import { createTRPCRouter } from "@/core/trpc/base/init"
import { contentGetHomeContentProcedure } from "./procedure/get-home-content"
import { contentGetLogArchiveProcedure } from "./procedure/get-log-archive"
import { contentGetLogDetailProcedure } from "./procedure/get-log-detail"
import { contentGetPostArchiveProcedure } from "./procedure/get-post-archive"
import { contentGetPostDetailProcedure } from "./procedure/get-post-detail"
import { contentGetSeriesArchiveProcedure } from "./procedure/get-series-archive"
import { contentGetSeriesPostDetailProcedure } from "./procedure/get-series-post-detail"

export const contentRouter = createTRPCRouter({
  getHomeContent: contentGetHomeContentProcedure,
  getLogDetail: contentGetLogDetailProcedure,
  getLogArchive: contentGetLogArchiveProcedure,
  getPostDetail: contentGetPostDetailProcedure,
  getPostArchive: contentGetPostArchiveProcedure,
  getSeriesArchive: contentGetSeriesArchiveProcedure,
  getSeriesPostDetail: contentGetSeriesPostDetailProcedure,
})
