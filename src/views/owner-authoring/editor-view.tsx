"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { useCreateDraft } from "@/domain/blog/hook/use-create-draft"
import { useCreateSeries } from "@/domain/blog/hook/use-create-series"
import { usePublish } from "@/domain/blog/hook/use-publish"
import { useUpdateDraft } from "@/domain/blog/hook/use-update-draft"
import type {
  EditablePost,
  PostType,
  PublishedSeriesSummary,
} from "@/domain/blog/lib/model"
import { postTypeToCollection } from "@/domain/blog/lib/model"
import { Button } from "@/shared/ui/button"
import { RichMarkdownEditor } from "@/widgets/editor/rich-markdown-editor"

type EditorViewProps = {
  mode: "new" | "edit"
  type: PostType
  initialPost: EditablePost | null
  availableSeries: PublishedSeriesSummary[]
}

type SeriesState = {
  seriesId: string
  orderIndex: string
  chapterLabel: string
}

function normalizeTagInput(value: string) {
  return [
    ...new Set(
      value
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean),
    ),
  ]
}

export function EditorView({
  mode,
  type,
  initialPost,
  availableSeries,
}: EditorViewProps) {
  const router = useRouter()
  const createDraft = useCreateDraft()
  const updateDraft = useUpdateDraft()
  const publishPost = usePublish()
  const createSeries = useCreateSeries()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState(initialPost?.title ?? "")
  const [slug, setSlug] = useState(initialPost?.slug ?? "")
  const [summary, setSummary] = useState(initialPost?.summary ?? "")
  const [tagsInput, setTagsInput] = useState(
    (initialPost?.tagNames ?? []).join(", "),
  )
  const [markdownValue, setMarkdownValue] = useState(
    initialPost?.contentMarkdown ?? "",
  )
  const [markdownEditorKey, setMarkdownEditorKey] = useState(
    () => `${mode}-${initialPost?.id ?? "new"}`,
  )
  const [markdownSource, setMarkdownSource] = useState(
    initialPost?.contentMarkdown ?? "",
  )
  const [seriesOptions, setSeriesOptions] = useState(availableSeries)
  const [seriesState, setSeriesState] = useState<SeriesState>({
    seriesId: initialPost?.series?.seriesId ?? "",
    orderIndex: initialPost?.series?.orderIndex
      ? String(initialPost.series.orderIndex)
      : "",
    chapterLabel: initialPost?.series?.chapterLabel ?? "",
  })
  const [newSeriesTitle, setNewSeriesTitle] = useState("")
  const [newSeriesDescription, setNewSeriesDescription] = useState("")
  const [newSeriesCoverImageUrl, setNewSeriesCoverImageUrl] = useState("")

  const canPublish = mode === "edit" && initialPost !== null
  const collection = postTypeToCollection(type)
  const isBooklog = type === "BOOKLOG"
  const mutationBusy =
    createDraft.isPending ||
    updateDraft.isPending ||
    publishPost.isPending ||
    createSeries.isPending ||
    isPending

  const parsedSeries = useMemo(() => {
    if (!isBooklog || !seriesState.seriesId || !seriesState.orderIndex) {
      return null
    }

    return {
      seriesId: seriesState.seriesId,
      orderIndex: Number(seriesState.orderIndex),
      chapterLabel: seriesState.chapterLabel.trim() || null,
    }
  }, [isBooklog, seriesState])

  async function handleSave() {
    const payload = {
      title,
      slug: slug.trim() || null,
      summary: summary.trim() || null,
      contentMarkdown: markdownValue,
      tagNames: normalizeTagInput(tagsInput),
      series: parsedSeries,
    }

    if (mode === "new") {
      const created = await createDraft.mutateAsync({
        type,
        ...payload,
      })

      startTransition(() => {
        router.push(
          `/${postTypeToCollection(created.type)}/${created.slug}/edit`,
        )
        router.refresh()
      })
      return
    }

    if (!initialPost) {
      return
    }

    const updated = await updateDraft.mutateAsync({
      postId: initialPost.id,
      ...payload,
    })

    startTransition(() => {
      router.push(`/${postTypeToCollection(updated.type)}/${updated.slug}/edit`)
      router.refresh()
    })
  }

  async function handlePublish() {
    if (!initialPost) {
      return
    }

    const published = await publishPost.mutateAsync({ postId: initialPost.id })

    startTransition(() => {
      router.push(`/${postTypeToCollection(published.type)}/${published.slug}`)
      router.refresh()
    })
  }

  async function handleCreateSeries() {
    const created = await createSeries.mutateAsync({
      title: newSeriesTitle,
      description: newSeriesDescription.trim() || null,
      coverImageUrl: newSeriesCoverImageUrl.trim() || null,
    })

    setSeriesOptions((current) => [
      {
        id: created.id,
        slug: created.slug,
        title: created.title,
        description: created.description,
        coverImageUrl: created.coverImageUrl,
        href: `/booklog/series/${created.slug}`,
        postCount: 0,
        updatedAt: created.updatedAt,
      },
      ...current,
    ])
    setSeriesState((current) => ({ ...current, seriesId: created.id }))
    setNewSeriesTitle("")
    setNewSeriesDescription("")
    setNewSeriesCoverImageUrl("")
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
            {mode === "new" ? `New ${type}` : `Edit ${type}`}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {mode === "new"
              ? `Start a new ${collection} draft`
              : `Edit ${initialPost?.title ?? "draft"}`}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            Use Lexical for the editing experience while the persisted source of
            truth remains Markdown.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-foreground">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
              placeholder="Give the post a clear title"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-foreground">Slug</span>
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
              placeholder="Generated from the title when left blank"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm block">
          <span className="font-medium text-foreground">Summary</span>
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            className="min-h-28 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
            placeholder="A concise description used in public reading lists."
          />
        </label>

        <label className="space-y-2 text-sm block">
          <span className="font-medium text-foreground">Tags</span>
          <input
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
            placeholder="Separate tags with commas"
          />
        </label>
      </section>

      {isBooklog ? (
        <section className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              BOOKLOG series
            </h2>
            <p className="text-sm text-muted-foreground">
              Connect this entry to an existing series or create one inline.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm md:col-span-2">
              <span className="font-medium text-foreground">Series</span>
              <select
                value={seriesState.seriesId}
                onChange={(event) =>
                  setSeriesState((current) => ({
                    ...current,
                    seriesId: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
              >
                <option value="">No series</option>
                {seriesOptions.map((series) => (
                  <option key={series.id} value={series.id}>
                    {series.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-foreground">Order</span>
              <input
                type="number"
                min="1"
                value={seriesState.orderIndex}
                onChange={(event) =>
                  setSeriesState((current) => ({
                    ...current,
                    orderIndex: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
                placeholder="1"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm block">
            <span className="font-medium text-foreground">Chapter label</span>
            <input
              value={seriesState.chapterLabel}
              onChange={(event) =>
                setSeriesState((current) => ({
                  ...current,
                  chapterLabel: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
              placeholder="Chapter 1"
            />
          </label>

          <div className="rounded-2xl border border-dashed border-border p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold tracking-tight">
                Create a new series
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-foreground">
                    Series title
                  </span>
                  <input
                    value={newSeriesTitle}
                    onChange={(event) => setNewSeriesTitle(event.target.value)}
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-foreground">
                    Cover image URL
                  </span>
                  <input
                    value={newSeriesCoverImageUrl}
                    onChange={(event) =>
                      setNewSeriesCoverImageUrl(event.target.value)
                    }
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm block">
                <span className="font-medium text-foreground">Description</span>
                <textarea
                  value={newSeriesDescription}
                  onChange={(event) =>
                    setNewSeriesDescription(event.target.value)
                  }
                  className="min-h-24 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
                />
              </label>
              <Button
                type="button"
                variant="outline"
                onClick={handleCreateSeries}
                disabled={createSeries.isPending || !newSeriesTitle.trim()}
              >
                {createSeries.isPending
                  ? "Creating series..."
                  : "Create series"}
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Editor</h2>
          <p className="text-sm text-muted-foreground">
            Rich-text editing is powered by Lexical. The saved source remains
            Markdown.
          </p>
        </div>

        <RichMarkdownEditor
          markdown={markdownValue}
          editorKey={markdownEditorKey}
          onChange={(value) => {
            setMarkdownValue(value)
            setMarkdownSource(value)
          }}
        />

        <details className="rounded-2xl border border-dashed border-border p-4">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            Raw Markdown source
          </summary>
          <div className="mt-4 space-y-3">
            <textarea
              value={markdownSource}
              onChange={(event) => setMarkdownSource(event.target.value)}
              className="min-h-60 w-full rounded-2xl border border-border bg-background px-4 py-3 font-mono text-sm outline-none ring-0"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setMarkdownValue(markdownSource)
                setMarkdownEditorKey(`${Date.now()}`)
              }}
            >
              Apply Markdown to editor
            </Button>
          </div>
        </details>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={handleSave}
          disabled={mutationBusy || !title.trim()}
        >
          {mutationBusy
            ? "Saving..."
            : mode === "new"
              ? "Create draft"
              : "Save draft"}
        </Button>
        {canPublish ? (
          <Button
            type="button"
            variant="secondary"
            onClick={handlePublish}
            disabled={mutationBusy}
          >
            {publishPost.isPending ? "Publishing..." : "Publish"}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
