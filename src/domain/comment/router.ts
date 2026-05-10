import { createTRPCRouter } from "@/core/trpc/base/init"
import { commentGetListProcedure } from "./procedure/get-list"
import { commentCreateProcedure } from "./procedure/post-create-comment"

export const commentRouter = createTRPCRouter({
  list: commentGetListProcedure,
  create: commentCreateProcedure,
})
