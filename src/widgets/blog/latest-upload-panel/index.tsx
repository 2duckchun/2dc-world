import { cn } from "@/shared/lib/utils"
import { LatestUploadBody } from "./components/latest-upload-body"
import { LatestUploadHeader } from "./components/latest-upload-header"
import type { LatestUploadPanelProps } from "./types"

export type { LatestUploadItem } from "./types"

export function LatestUploadPanel({
  eyebrow,
  title,
  titleId,
  spotlight,
  posts,
  className,
  style,
}: LatestUploadPanelProps) {
  return (
    <section
      className={cn(
        "animate-rise overflow-hidden rounded-lg border border-border bg-card shadow-sm",
        className,
      )}
      style={style}
      aria-labelledby={titleId}
    >
      <LatestUploadHeader eyebrow={eyebrow} title={title} titleId={titleId} />
      <LatestUploadBody spotlight={spotlight} posts={posts} />
    </section>
  )
}
