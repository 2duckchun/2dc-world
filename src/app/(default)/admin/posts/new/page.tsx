import type { Metadata } from "next"
import { forbidden } from "next/navigation"
import { auth } from "@/auth"
import { trpcServerCaller } from "@/core/trpc/server/trpc-server-caller"
import { AdminPostCreateView } from "@/views/admin-post-create"

export const metadata: Metadata = {
  title: "새 글 작성",
}

export default async function AdminPostCreatePage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    forbidden()
  }

  const caller = await trpcServerCaller()
  const seriesOptions = await caller.series.getOptions()

  return <AdminPostCreateView seriesOptions={seriesOptions} />
}
