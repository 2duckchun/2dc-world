import { createTRPCRouter } from "@/core/trpc/base/init"
import { likeTogglePostLikeProcedure } from "./procedure/post-toggle-post-like"

export const likeRouter = createTRPCRouter({
  togglePostLike: likeTogglePostLikeProcedure,
})
