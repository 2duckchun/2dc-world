"use client"

import { AlertCircle, Save } from "lucide-react"
import { FormProvider } from "react-hook-form"
import type { PostCreatePostInput } from "@/domain/post/procedure/post-create-post/schema"
import { Button } from "@/shared/ui/button"

import {
  defaultPostEditorValues,
  usePostEditorForm,
} from "./post-editor-form-hook"
import { PostContentMarkdownField } from "./shared/fields/post-content-markdown-field"
import { PostKindRadioField } from "./shared/fields/post-kind-radio-field"
import { PostSeriesFields } from "./shared/fields/post-series-fields"
import { PostSlugInputField } from "./shared/fields/post-slug-input-field"
import { PostStatusSelectField } from "./shared/fields/post-status-select-field"
import { PostSubtitleInputField } from "./shared/fields/post-subtitle-input-field"
import { PostTagsInputField } from "./shared/fields/post-tags-input-field"
import { PostThumbnailInputField } from "./shared/fields/post-thumbnail-input-field"
import { PostTitleInputField } from "./shared/fields/post-title-input-field"

type SeriesOption = {
  id: string
  title: string
}

type PostEditorFormProps = {
  mode?: "create" | "edit"
  seriesOptions: SeriesOption[]
  initialValues?: PostCreatePostInput
  postId?: string
}

function getSubmitLabel(mode: "create" | "edit", isPending: boolean) {
  if (mode === "edit") {
    return isPending ? "수정 중" : "수정 저장"
  }
  return isPending ? "저장 중" : "저장"
}

export function PostEditorForm({
  mode = "create",
  seriesOptions,
  initialValues = defaultPostEditorValues,
  postId,
}: PostEditorFormProps) {
  const { form, handleSubmit, isPending, rootError } = usePostEditorForm({
    mode,
    initialValues,
    postId,
  })

  const submitLabel = getSubmitLabel(mode, isPending)

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="grid gap-6">
        <section className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <PostTitleInputField />
            <PostStatusSelectField />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <PostSlugInputField />
            <PostSubtitleInputField />
          </div>

          <PostThumbnailInputField />
          <PostTagsInputField />
          <PostKindRadioField />
          <PostSeriesFields seriesOptions={seriesOptions} />
        </section>

        <PostContentMarkdownField />

        <div className="flex flex-wrap items-center justify-between gap-3">
          {rootError && (
            <p
              className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-destructive/35 bg-destructive/10 px-3 py-2 text-destructive text-sm"
              aria-live="polite"
            >
              <AlertCircle className="size-4" />
              {rootError}
            </p>
          )}
          <Button
            type="submit"
            disabled={isPending}
            className="ml-auto min-w-24"
          >
            <Save data-icon="inline-start" className="size-4" />
            {submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
