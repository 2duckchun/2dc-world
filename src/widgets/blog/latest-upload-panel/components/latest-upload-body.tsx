import { cn } from "@/shared/lib/utils"
import type { LatestUploadItem } from "../types"
import { LatestUploadList } from "./latest-upload-list"
import { LatestUploadSpotlight } from "./latest-upload-spotlight"

type LatestUploadBodyProps = {
  spotlight: LatestUploadItem | null
  posts: readonly LatestUploadItem[]
}

export function LatestUploadBody({ spotlight, posts }: LatestUploadBodyProps) {
  const hasPosts = posts.length > 0

  return (
    <div className={cn("grid", hasPosts && "lg:grid-cols-[1.15fr_0.85fr]")}>
      <LatestUploadSpotlight spotlight={spotlight} hasPosts={hasPosts} />
      <LatestUploadList posts={posts} />
    </div>
  )
}
