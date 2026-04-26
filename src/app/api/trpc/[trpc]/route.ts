import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { createTRPCContext } from "@/core/trpc/context"
import { appRouter } from "@/core/trpc/router"

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req }),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ error, path }) => {
            console.error(`[tRPC] ${path ?? "<unknown>"} failed`, error)
          }
        : undefined,
  })

export { handler as GET, handler as POST }
