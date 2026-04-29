import { createTRPCRouter } from "@/core/trpc/base/init"
import { contentGetHomeContentProcedure } from "./procedure/get-home-content"

export const contentRouter = createTRPCRouter({
  getHomeContent: contentGetHomeContentProcedure,
})
