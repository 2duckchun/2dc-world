import type { Metadata } from "next"
import { forbidden } from "next/navigation"
import { auth } from "@/auth"
import {
  getServerQueryClient,
  PrefetchBoundary,
} from "@/core/tanstack-query/prefetch-boundary"
import { trpcServerProxy } from "@/core/trpc/server/create-trpc-proxy"
import { AdminSeriesView } from "@/views/admin-series"

export const metadata: Metadata = {
  title: "시리즈 관리",
}

export default async function AdminSeriesPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    forbidden()
  }

  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(trpcServerProxy.series.list.queryOptions())

  return (
    <PrefetchBoundary>
      <AdminSeriesView />
    </PrefetchBoundary>
  )
}
