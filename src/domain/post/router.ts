import { createTRPCRouter } from "@/core/trpc/base/init"
import { getLatestPostsProcedure } from "./procedure/get-latest-posts"
import { postCreatePostProcedure } from "./procedure/post-create-post"

export const postRouter = createTRPCRouter({
  create: postCreatePostProcedure,
  getLatestPosts: getLatestPostsProcedure,
})
