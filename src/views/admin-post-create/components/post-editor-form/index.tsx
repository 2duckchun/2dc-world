"use client"

import { AlertCircle, Save } from "lucide-react"
import { FormProvider } from "react-hook-form"
import { Button } from "@/shared/ui/button"
import { PostContentMarkdownField } from "./fields/post-content-markdown-field"
import { PostKindRadioField } from "./fields/post-kind-radio-field"
import { PostSeriesFields } from "./fields/post-series-fields"
import { PostSlugInputField } from "./fields/post-slug-input-field"
import { PostStatusSelectField } from "./fields/post-status-select-field"
import { PostSubtitleInputField } from "./fields/post-subtitle-input-field"
import { PostThumbnailInputField } from "./fields/post-thumbnail-input-field"
import { PostTitleInputField } from "./fields/post-title-input-field"
import { usePostEditorForm } from "./post-editor-form-hook"

type SeriesOption = {
  id: string
  title: string
}

type PostEditorFormProps = {
  seriesOptions: SeriesOption[]
}

export function PostEditorForm({ seriesOptions }: PostEditorFormProps) {
  const { form, handleSubmit, isPending, rootError } = usePostEditorForm()

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
            {isPending ? "저장 중" : "저장"}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
