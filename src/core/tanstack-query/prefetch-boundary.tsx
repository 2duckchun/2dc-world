import "server-only"

import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { cache, type ReactNode } from "react"
import { makeQueryClient } from "@/core/tanstack-query/query-client"

export const getServerQueryClient = cache(makeQueryClient)

type PrefetchBoundaryProps = {
  children: ReactNode
}

export function PrefetchBoundary({ children }: PrefetchBoundaryProps) {
  return (
    <HydrationBoundary state={dehydrate(getServerQueryClient())}>
      {children}
    </HydrationBoundary>
  )
}
