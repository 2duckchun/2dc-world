import "server-only"

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import { getServerQueryClient } from "@/core/tanstack-query/prefetch-boundary"
import { appRouter } from "@/core/trpc/router"
import { createTRPCContext } from "@/core/trpc/server/context"

export const trpcServerProxy = createTRPCOptionsProxy({
  router: appRouter,
  ctx: () => createTRPCContext(),
  queryClient: getServerQueryClient,
})
