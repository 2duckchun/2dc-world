import type { Metadata } from "next"
import { requireOwnerSession } from "@/core/auth/require-owner-session"
import { getServerCaller } from "@/core/trpc/server"
import { DashboardView } from "@/views/owner-authoring/dashboard-view"

export const metadata: Metadata = {
  title: "Write | 2dc world",
  description: "Owner authoring dashboard for 2dc world.",
}

export default async function WritePage() {
  await requireOwnerSession()
  const caller = await getServerCaller()
  const drafts = await caller.blog.getDraftList({})

  return <DashboardView drafts={drafts} />
}
