import { Clock3 } from "lucide-react"
import type { LatestUploadItem } from "../types"

type LatestUploadMetaProps = Pick<LatestUploadItem, "category" | "meta">

export function LatestUploadMeta({ category, meta }: LatestUploadMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="rounded-lg bg-chart-2/12 px-2.5 py-1 font-medium text-chart-2">
        {category}
      </span>
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <Clock3 className="size-4" />
        {meta}
      </span>
    </div>
  )
}
