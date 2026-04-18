import { initTRPC, TRPCError } from "@trpc/server"
import {
  getViewerCapabilities,
  type ViewerCapabilities,
  type ViewerSession,
} from "@/core/auth"

export type TRPCContext = {
  session: ViewerSession
  capabilities: ViewerCapabilities
}

const t = initTRPC.context<TRPCContext>().create()

const requireAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session.isAuthenticated) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return next()
})

const requireOwner = t.middleware(({ ctx, next }) => {
  if (!ctx.session.isOwner) {
    throw new TRPCError({ code: "FORBIDDEN" })
  }

  return next()
})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(requireAuthenticated)
export const ownerProcedure = t.procedure.use(requireOwner)
export const buildCapabilities = getViewerCapabilities
