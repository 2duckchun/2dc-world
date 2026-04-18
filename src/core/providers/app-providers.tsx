"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { type PropsWithChildren, useState } from "react"
import { getQueryClient } from "@/core/query/query-client"
import { ThemeProvider } from "@/core/theme/theme-provider"
import { TRPCProvider } from "@/core/trpc/client"
import type { AppRouter } from "@/core/trpc/router"

type AppProvidersProps = PropsWithChildren<{
  session: Session | null
}>

export function AppProviders({ children, session }: AppProvidersProps) {
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    }),
  )

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
          <ThemeProvider>{children}</ThemeProvider>
        </TRPCProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
