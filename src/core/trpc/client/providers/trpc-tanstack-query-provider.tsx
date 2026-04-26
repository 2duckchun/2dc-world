"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import { createTRPCContext } from "@trpc/tanstack-react-query"
import { type ReactNode, useState } from "react"
import type { AppRouter } from "@/core/trpc/router"
import { getQueryClient } from "../../../tanstack-query/query-client"

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>()

const getBaseUrl = () => `/api/trpc`

type TrpcTanstackQueryProvider = {
  children: ReactNode
}

export function TrpcTanstackQueryProvider({
  children,
}: TrpcTanstackQueryProvider) {
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: getBaseUrl(),
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}
