import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { createTRPCContext } from "@/core/trpc/context"
import { appRouter } from "@/core/trpc/router"

export const dynamic = "force-dynamic"

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => createTRPCContext(),
  })

export { handler as GET, handler as POST }
