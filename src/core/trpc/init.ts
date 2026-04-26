import { initTRPC, TRPCError } from "@trpc/server"
import type { TRPCContext } from "@/core/trpc/context"

const t = initTRPC.context<TRPCContext>().create()

export const createCallerFactory = t.createCallerFactory
export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

export const adminProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session?.user || ctx.session.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "관리자 권한이 필요합니다.",
    })
  }

  return next()
})
