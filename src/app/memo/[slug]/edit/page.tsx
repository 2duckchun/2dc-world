import { TRPCError } from "@trpc/server"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireOwnerSession } from "@/core/auth/require-owner-session"
import { getServerCaller } from "@/core/trpc/server"
import { EditorView } from "@/views/owner-authoring/editor-view"

type MemoEditPageProps = {
  params: Promise<{ slug: string }>
}

async function getEditable(slug: string) {
  const caller = await getServerCaller()

  try {
    return await caller.blog.getEditablePost({ type: "MEMO", slug })
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return null
    }

    throw error
  }
}

export const metadata: Metadata = {
  title: "Edit MEMO | 2dc world",
}

export default async function MemoEditPage({ params }: MemoEditPageProps) {
  await requireOwnerSession()
  const { slug } = await params
  const item = await getEditable(slug)

  if (!item) {
    notFound()
  }

  return (
    <EditorView
      mode="edit"
      type="MEMO"
      initialPost={item}
      availableSeries={[]}
    />
  )
}
