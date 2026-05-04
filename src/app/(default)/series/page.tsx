import type { Metadata } from "next"
import {
  getServerQueryClient,
  PrefetchBoundary,
} from "@/core/tanstack-query/prefetch-boundary"
import { trpcServerProxy } from "@/core/trpc/server/create-trpc-proxy"
import { SeriesView } from "@/views/series"

export const metadata: Metadata = {
  title: "Series",
  description: "Published series from 2dc world.",
}

export default async function SeriesPage() {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(
    trpcServerProxy.content.getSeriesArchive.queryOptions(),
  )

  return (
    <PrefetchBoundary>
      <SeriesView />
    </PrefetchBoundary>
  )
}
