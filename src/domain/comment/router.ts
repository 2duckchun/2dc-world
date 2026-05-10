import { createTRPCRouter } from "@/core/trpc/base/init"
import { commentGetListProcedure } from "./procedure/get-list"

export const commentRouter = createTRPCRouter({
  list: commentGetListProcedure,
})
