import "server-only"

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import { createTRPCContext } from "@/core/trpc/context"
import { appRouter } from "@/core/trpc/router"
import { makeQueryClient } from "../tanstack-query/query-client"

export const createTRPCServer = async () =>
  createTRPCOptionsProxy({
    router: appRouter,
    ctx: () => createTRPCContext(),
    queryClient: makeQueryClient,
  })
