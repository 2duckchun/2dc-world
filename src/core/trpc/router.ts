import { blogRouter } from "@/domain/blog/procedure/router"
import { viewerRouter } from "@/domain/viewer/procedure/router"
import { createCallerFactory, createTRPCRouter } from "./init"

export const appRouter = createTRPCRouter({
  viewer: viewerRouter,
  blog: blogRouter,
})

export const createTRPCCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
