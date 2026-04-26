import { TRPCError } from "@trpc/server"
import { createTRPCMiddleware } from "../init"

export const adminMiddleware = createTRPCMiddleware(({ ctx, next }) => {
  if (!ctx.session?.user || ctx.session.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "관리자 권한이 필요합니다.",
    })
  }

  return next()
})
