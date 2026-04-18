import { TRPCError } from "@trpc/server"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireOwnerSession } from "@/core/auth/require-owner-session"
import { getServerCaller } from "@/core/trpc/server"
import { EditorView } from "@/views/owner-authoring/editor-view"

type BooklogEditPageProps = {
  params: Promise<{ slug: string }>
}

async function getEditable(slug: string) {
  const caller = await getServerCaller()

  try {
    return await caller.blog.getEditablePost({ type: "BOOKLOG", slug })
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return null
    }

    throw error
  }
}

export const metadata: Metadata = {
  title: "Edit BOOKLOG | 2dc world",
}

export default async function BooklogEditPage({
  params,
}: BooklogEditPageProps) {
  await requireOwnerSession()
  const caller = await getServerCaller()
  const { slug } = await params
  const [item, availableSeries] = await Promise.all([
    getEditable(slug),
    caller.blog.getSeriesList(),
  ])

  if (!item) {
    notFound()
  }

  return (
    <EditorView
      mode="edit"
      type="BOOKLOG"
      initialPost={item}
      availableSeries={availableSeries}
    />
  )
}
