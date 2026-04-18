import { MarkdownContent } from "@/widgets/markdown-content/markdown-content"
import { PostMetaLine } from "@/widgets/post-meta-line/post-meta-line"
import { estimateReadingTime, formatDateLabel } from "./lib/format"
import type { ReadingDetailViewProps } from "./types"

export function PostDetailView({ item }: ReadingDetailViewProps) {
  const readingTime = estimateReadingTime(item.contentMarkdown)
  const publishedLabel = formatDateLabel(item.publishedAt)

  return (
    <article className="space-y-8">
      <header className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
            {item.type}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {item.title}
          </h1>
          {item.summary ? (
            <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {item.summary}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {publishedLabel ? <span>Published {publishedLabel}</span> : null}
          {readingTime ? <span>{readingTime}</span> : null}
        </div>

        <PostMetaLine item={item} />
      </header>

      <MarkdownContent markdown={item.contentMarkdown} />
    </article>
  )
}
