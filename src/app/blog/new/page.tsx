import type { Metadata } from "next"
import { requireOwnerSession } from "@/core/auth/require-owner-session"
import { EditorView } from "@/views/owner-authoring/editor-view"

export const metadata: Metadata = {
  title: "New BLOG | 2dc world",
}

export default async function NewBlogPage() {
  await requireOwnerSession()

  return (
    <EditorView
      mode="new"
      type="BLOG"
      initialPost={null}
      availableSeries={[]}
    />
  )
}
