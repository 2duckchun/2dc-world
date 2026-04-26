import { postRouter } from "@/domain/post/router"
import { createTRPCRouter } from "./init"

export const appRouter = createTRPCRouter({
  post: postRouter,
})

export type AppRouter = typeof appRouter
