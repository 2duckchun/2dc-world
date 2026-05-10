import { contentRouter } from "@/domain/content/router"
import { likeRouter } from "@/domain/like/router"
import { postRouter } from "@/domain/post/router"
import { seriesRouter } from "@/domain/series/router"
import { createTRPCRouter } from "./base/init"

export const appRouter = createTRPCRouter({
  content: contentRouter,
  like: likeRouter,
  post: postRouter,
  series: seriesRouter,
})

export type AppRouter = typeof appRouter
