"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { PostEditorForm } from "./post-editor-form"

export function AdminPostCreateForm() {
  const trpc = useTRPC()
  const { data: seriesOptions } = useSuspenseQuery(
    trpc.series.getOptions.queryOptions(),
  )

  return <PostEditorForm mode="create" seriesOptions={seriesOptions} />
}
