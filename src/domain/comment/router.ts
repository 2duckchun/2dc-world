import { createTRPCRouter } from "@/core/trpc/base/init"
import { commentGetListProcedure } from "./procedure/get-list"
import { commentCreateProcedure } from "./procedure/post-create-comment"
import { commentUpdateProcedure } from "./procedure/post-update-comment"

export const commentRouter = createTRPCRouter({
  list: commentGetListProcedure,
  create: commentCreateProcedure,
  update: commentUpdateProcedure,
})
