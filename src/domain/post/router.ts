import { createTRPCRouter } from "@/core/trpc/init"
import { getLatestPostsProcedure } from "./procedure/get-latest-posts"

export const postRouter = createTRPCRouter({
  getLatestPosts: getLatestPostsProcedure,
})
