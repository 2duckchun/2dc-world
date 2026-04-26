import "server-only"

import { createTRPCContext } from "@/core/trpc/context"
import { appRouter } from "@/core/trpc/router"
import { createCallerFactory } from "./init"

const createCaller = createCallerFactory(appRouter)

export const createTRPCCaller = async () =>
  createCaller(await createTRPCContext())
