import { createTRPCRouter } from "@/core/trpc/base/init"
import { getLatestPostsProcedure } from "./procedure/get-latest-posts"

export const postRouter = createTRPCRouter({
  getLatestPosts: getLatestPostsProcedure,
})
