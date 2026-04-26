import "server-only"

import { appRouter } from "@/core/trpc/router"
import { createTRPCContext } from "@/core/trpc/server/context"
import { createCallerFactory } from "../base/init"

const createCaller = createCallerFactory(appRouter)

export const trpcServerCaller = async () =>
  createCaller(await createTRPCContext())
