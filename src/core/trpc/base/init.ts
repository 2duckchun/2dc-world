import { initTRPC } from "@trpc/server"
import type { TRPCContext } from "@/core/trpc/server/context"

const t = initTRPC.context<TRPCContext>().create()

export const createCallerFactory = t.createCallerFactory
export const createTRPCRouter = t.router
export const createTRPCMiddleware = t.middleware
export const baseProcedure = t.procedure
