import { TRPCError } from "@trpc/server"
import { createTRPCMiddleware } from "../init"

export const authMiddleware = createTRPCMiddleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "로그인이 필요합니다.",
    })
  }

  return next()
})
