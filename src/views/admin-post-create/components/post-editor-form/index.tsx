"use client"

import { AlertCircle, Save } from "lucide-react"
import { FormProvider } from "react-hook-form"
import type { PostCreatePostInput } from "@/domain/post/procedure/post-create-post/schema"
import { Button } from "@/shared/ui/button"
import { PostContentMarkdownField } from "./fields/post-content-markdown-field"
import { PostKindRadioField } from "./fields/post-kind-radio-field"
import { PostSeriesFields } from "./fields/post-series-fields"
import { PostSlugInputField } from "./fields/post-slug-input-field"
import { PostStatusSelectField } from "./fields/post-status-select-field"
import { PostSubtitleInputField } from "./fields/post-subtitle-input-field"
import { PostTagsInputField } from "./fields/post-tags-input-field"
import { PostThumbnailInputField } from "./fields/post-thumbnail-input-field"
import { PostTitleInputField } from "./fields/post-title-input-field"
import {
  defaultPostEditorValues,
  usePostEditorForm,
} from "./post-editor-form-hook"

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
  const submitLabel =
    mode === "edit"
      ? isPending
        ? "수정 중"
        : "수정 저장"
      : isPending
        ? "저장 중"
        : "저장"

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
          {rootError ? (
            <p
              className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-destructive/35 bg-destructive/10 px-3 py-2 text-destructive text-sm"
              aria-live="polite"
            >
              <AlertCircle className="size-4" />
              {rootError}
            </p>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={isPending} className="min-w-24">
            <Save data-icon="inline-start" className="size-4" />
            {submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
