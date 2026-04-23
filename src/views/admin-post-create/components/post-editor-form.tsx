"use client"

import { CheckCircle2, Save, UploadCloud } from "lucide-react"
import { useActionState, useEffect, useMemo, useState } from "react"
import {
  type CreatePostState,
  createPostAction,
} from "@/domain/content/actions"
import { createSlug } from "@/domain/content/slug"
import {
  type PostKind,
  postKindLabels,
  postKindValues,
  postStatusLabels,
  postStatusValues,
} from "@/domain/content/types"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"
import { MarkdownEditor } from "./markdown-editor"

type SeriesOption = {
  id: string
  title: string
}

type PostEditorFormProps = {
  seriesOptions: SeriesOption[]
}

const initialState = {
  message: "",
  status: "idle",
} satisfies CreatePostState

const defaultMarkdown = `# 제목

본문을 작성하세요.
`

export function PostEditorForm({ seriesOptions }: PostEditorFormProps) {
  const [state, formAction, isPending] = useActionState(
    createPostAction,
    initialState,
  )
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [isSlugEdited, setIsSlugEdited] = useState(false)
  const [kind, setKind] = useState<PostKind>("post")
  const [markdown, setMarkdown] = useState(defaultMarkdown)

  useEffect(() => {
    if (!isSlugEdited) {
      setSlug(createSlug(title))
    }
  }, [isSlugEdited, title])

  const isSeriesKind = kind === "series"
  const statusTone = useMemo(() => {
    if (state.status === "success") {
      return "border-chart-2/35 bg-chart-2/10 text-chart-2"
    }

    if (state.status === "error") {
      return "border-destructive/35 bg-destructive/10 text-destructive"
    }

    return "hidden"
  }, [state.status])

  return (
    <form action={formAction} className="grid gap-6">
      <section className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <label className="grid gap-2">
            <span className="font-medium text-sm">제목</span>
            <input
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/25"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-medium text-sm">상태</span>
            <select
              name="status"
              defaultValue="draft"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/25"
            >
              {postStatusValues.map((status) => (
                <option key={status} value={status}>
                  {postStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <label className="grid gap-2">
            <span className="font-medium text-sm">슬러그</span>
            <input
              name="slug"
              value={slug}
              onChange={(event) => {
                setIsSlugEdited(true)
                setSlug(createSlug(event.target.value))
              }}
              required
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/25"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-medium text-sm">부제목</span>
            <input
              name="subtitle"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/25"
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="font-medium text-sm">썸네일 URL</span>
          <input
            name="thumbnail"
            type="url"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/25"
          />
        </label>

        <fieldset className="grid gap-2">
          <legend className="font-medium text-sm">분류</legend>
          <div className="grid grid-cols-3 rounded-lg border border-border bg-background p-1">
            {postKindValues.map((value) => (
              <label key={value} className="min-w-0">
                <input
                  type="radio"
                  name="kind"
                  value={value}
                  checked={kind === value}
                  onChange={() => setKind(value)}
                  className="peer sr-only"
                />
                <span className="flex h-9 cursor-pointer items-center justify-center rounded-md px-2 text-center font-medium text-muted-foreground text-sm transition peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-3 peer-focus-visible:ring-ring/40">
                  {postKindLabels[value]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {isSeriesKind ? (
          <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
            <label className="grid gap-2">
              <span className="font-medium text-sm">시리즈</span>
              <select
                name="seriesId"
                required={isSeriesKind}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/25"
              >
                <option value="">선택</option>
                {seriesOptions.map((series) => (
                  <option key={series.id} value={series.id}>
                    {series.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="font-medium text-sm">순서</span>
              <input
                name="seriesOrder"
                type="number"
                min="1"
                required={isSeriesKind}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/25"
              />
            </label>
          </div>
        ) : (
          <>
            <input name="seriesId" type="hidden" value="" />
            <input name="seriesOrder" type="hidden" value="" />
          </>
        )}
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-border border-b px-4 py-3">
          <div className="flex items-center gap-2 font-medium text-sm">
            <UploadCloud className="size-4 text-chart-1" />
            Markdown
          </div>
          <span className="rounded-md border border-border bg-background px-2 py-1 text-muted-foreground text-xs">
            S3
          </span>
        </div>
        <MarkdownEditor
          markdown={markdown}
          onChange={(value) => setMarkdown(value)}
          placeholder=""
          trim={false}
        />
        <input name="content" type="hidden" value={markdown} />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className={cn(
            "inline-flex min-h-9 items-center gap-2 rounded-lg border px-3 py-2 text-sm",
            statusTone,
          )}
          aria-live="polite"
        >
          {state.status === "success" ? (
            <CheckCircle2 className="size-4" />
          ) : null}
          {state.message}
        </p>
        <button
          type="submit"
          disabled={isPending}
          className={buttonVariants({ className: "min-w-24" })}
        >
          <Save data-icon="inline-start" className="size-4" />
          {isPending ? "저장 중" : "저장"}
        </button>
      </div>
    </form>
  )
}
