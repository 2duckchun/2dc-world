import type { Metadata } from "next"
import { requireOwnerSession } from "@/core/auth/require-owner-session"
import { getServerCaller } from "@/core/trpc/server"
import { EditorView } from "@/views/owner-authoring/editor-view"

export const metadata: Metadata = {
  title: "New BOOKLOG | 2dc world",
}

export default async function NewBooklogPage() {
  await requireOwnerSession()
  const caller = await getServerCaller()
  const availableSeries = await caller.blog.getSeriesList()

  return (
    <EditorView
      mode="new"
      type="BOOKLOG"
      initialPost={null}
      availableSeries={availableSeries}
    />
  )
}
