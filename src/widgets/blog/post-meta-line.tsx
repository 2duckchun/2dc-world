import { CalendarDays, Clock3, Layers3 } from "lucide-react"
import { type BlogPostType, blogPostTypeMeta } from "@/domain/blog/model"
import { formatPublishedDate } from "@/shared/lib/format-date"
import { cn } from "@/shared/lib/utils"

type PostMetaLineProps = {
  type: BlogPostType
  publishedAt: string
  readingMinutes: number
  seriesLabel?: string | null
  compact?: boolean
  className?: string
}

export function PostMetaLine({
  type,
  publishedAt,
  readingMinutes,
  seriesLabel,
  compact = false,
  className,
}: PostMetaLineProps) {
  const meta = blogPostTypeMeta[type]

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground",
        compact && "text-xs",
        className,
      )}
    >
      <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-2.5 py-1 font-medium text-foreground shadow-sm">
        {meta.shortLabel}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="size-3.5" />
        {formatPublishedDate(publishedAt)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock3 className="size-3.5" />
        {readingMinutes} min read
      </span>
      {seriesLabel ? (
        <span className="inline-flex items-center gap-1.5">
          <Layers3 className="size-3.5" />
          {seriesLabel}
        </span>
      ) : null}
    </div>
  )
}
