import Link from "next/link"
import type { PublishedPostSummary } from "@/domain/blog/lib/contracts"
import { formatDateLabel } from "@/views/public-reading/lib/format"
import { TagList } from "@/widgets/tag-list/tag-list"

type PostMetaLineProps = {
  item: Pick<
    PublishedPostSummary,
    "type" | "publishedAt" | "updatedAt" | "series" | "tags"
  >
}

export function PostMetaLine({ item }: PostMetaLineProps) {
  const publishedLabel = formatDateLabel(item.publishedAt)
  const updatedLabel = formatDateLabel(item.updatedAt)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{item.type}</span>
        {publishedLabel ? <span>Published {publishedLabel}</span> : null}
        {!publishedLabel && updatedLabel ? (
          <span>Updated {updatedLabel}</span>
        ) : null}
        {item.series ? (
          <Link
            href={item.series.href}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {item.series.title}
            {item.series.chapterLabel ? ` · ${item.series.chapterLabel}` : ""}
            {item.series.orderIndex ? ` · #${item.series.orderIndex}` : ""}
          </Link>
        ) : null}
      </div>
      <TagList tags={item.tags} />
    </div>
  )
}
