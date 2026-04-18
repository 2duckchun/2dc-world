import { TRPCError } from "@trpc/server"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireOwnerSession } from "@/core/auth/require-owner-session"
import { getServerCaller } from "@/core/trpc/server"
import { EditorView } from "@/views/owner-authoring/editor-view"

type BlogEditPageProps = {
  params: Promise<{ slug: string }>
}

async function getEditable(slug: string) {
  const caller = await getServerCaller()

  try {
    return await caller.blog.getEditablePost({ type: "BLOG", slug })
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return null
    }

    throw error
  }
}

export const metadata: Metadata = {
  title: "Edit BLOG | 2dc world",
}

export default async function BlogEditPage({ params }: BlogEditPageProps) {
  await requireOwnerSession()
  const { slug } = await params
  const item = await getEditable(slug)

  if (!item) {
    notFound()
  }

  return (
    <EditorView
      mode="edit"
      type="BLOG"
      initialPost={item}
      availableSeries={[]}
    />
  )
}
