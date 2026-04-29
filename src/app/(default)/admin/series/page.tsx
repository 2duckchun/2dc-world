import type { Metadata } from "next"
import { forbidden } from "next/navigation"
import { auth } from "@/auth"
import { trpcServerCaller } from "@/core/trpc/server/trpc-server-caller"
import { AdminSeriesView } from "@/views/admin-series"

export const metadata: Metadata = {
  title: "시리즈 관리",
}

export default async function AdminSeriesPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    forbidden()
  }

  const caller = await trpcServerCaller()
  const series = await caller.series.list()

  return <AdminSeriesView series={series} />
}
