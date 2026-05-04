import type { Metadata } from "next"
import {
  getServerQueryClient,
  PrefetchBoundary,
} from "@/core/tanstack-query/prefetch-boundary"
import { trpcServerProxy } from "@/core/trpc/server/create-trpc-proxy"
import { LogView } from "@/views/log"

export const metadata: Metadata = {
  title: "Log",
  description: "Short development notes, tips, and fixes from 2dc world.",
}

export default async function LogPage() {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(
    trpcServerProxy.content.getLogArchive.queryOptions(),
  )

  return (
    <PrefetchBoundary>
      <LogView />
    </PrefetchBoundary>
  )
}
