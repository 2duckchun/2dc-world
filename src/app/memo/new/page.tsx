import type { Metadata } from "next"
import { requireOwnerSession } from "@/core/auth/require-owner-session"
import { EditorView } from "@/views/owner-authoring/editor-view"

export const metadata: Metadata = {
  title: "New MEMO | 2dc world",
}

export default async function NewMemoPage() {
  await requireOwnerSession()

  return (
    <EditorView
      mode="new"
      type="MEMO"
      initialPost={null}
      availableSeries={[]}
    />
  )
}
