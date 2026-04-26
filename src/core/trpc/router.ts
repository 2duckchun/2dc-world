import { postRouter } from "@/domain/post/router"
import { seriesRouter } from "@/domain/series/router"
import { createTRPCRouter } from "./base/init"

export const appRouter = createTRPCRouter({
  post: postRouter,
  series: seriesRouter,
})

export type AppRouter = typeof appRouter
