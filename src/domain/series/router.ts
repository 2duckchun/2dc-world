import { createTRPCRouter } from "@/core/trpc/base/init"
import { seriesGetOptionsProcedure } from "./procedure/get-options"

export const seriesRouter = createTRPCRouter({
  getOptions: seriesGetOptionsProcedure,
})
