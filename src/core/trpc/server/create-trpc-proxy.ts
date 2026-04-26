import "server-only"

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import { appRouter } from "@/core/trpc/router"
import { createTRPCContext } from "@/core/trpc/server/context"
import { makeQueryClient } from "../../tanstack-query/query-client"

export const createTRPCServer = async () =>
  createTRPCOptionsProxy({
    router: appRouter,
    ctx: () => createTRPCContext(),
    queryClient: makeQueryClient,
  })
