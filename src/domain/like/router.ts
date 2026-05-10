import { createTRPCRouter } from "@/core/trpc/base/init"
import { likeGetPostStatsProcedure } from "./procedure/get-post-stats"
import { likeTogglePostLikeProcedure } from "./procedure/post-toggle-post-like"

export const likeRouter = createTRPCRouter({
  getPostStats: likeGetPostStatsProcedure,
  togglePostLike: likeTogglePostLikeProcedure,
})
