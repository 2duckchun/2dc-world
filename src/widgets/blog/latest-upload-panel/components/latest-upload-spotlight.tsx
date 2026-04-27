import { ArrowUpRight } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import type { LatestUploadItem } from "../types"
import { LatestUploadEmpty } from "./latest-upload-empty"
import { LatestUploadMeta } from "./latest-upload-meta"

type LatestUploadSpotlightProps = {
  spotlight: LatestUploadItem | null
  hasPosts: boolean
}

export function LatestUploadSpotlight({
  spotlight,
  hasPosts,
}: LatestUploadSpotlightProps) {
  const className = cn(
    "p-5 sm:p-7",
    hasPosts && "border-border border-b lg:border-r lg:border-b-0",
  )

  if (!spotlight) {
    return (
      <div className={className}>
        <LatestUploadEmpty />
      </div>
    )
  }

  return (
    <div className={className}>
      <SpotlightArticle post={spotlight} />
    </div>
  )
}

function SpotlightArticle({ post }: { post: LatestUploadItem }) {
  return (
    <a href={post.href} className="group block">
      <article className="grid gap-8">
        <LatestUploadMeta category={post.category} meta={post.meta} />

        <div className="flex items-end justify-between gap-5">
          <div className="grid gap-4">
            <h3 className="max-w-3xl text-balance font-black text-4xl leading-none tracking-normal transition-colors group-hover:text-chart-2 sm:text-5xl">
              {post.title}
            </h3>
            <p className="max-w-2xl text-muted-foreground text-lg leading-8">
              {post.summary}
            </p>
          </div>
          <span className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-foreground/30 group-hover:text-foreground">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </article>
    </a>
  )
}
