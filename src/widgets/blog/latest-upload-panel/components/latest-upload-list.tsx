import { ArrowUpRight } from "lucide-react"
import type { LatestUploadItem } from "../types"
import { LatestUploadMeta } from "./latest-upload-meta"

type LatestUploadListProps = {
  posts: readonly LatestUploadItem[]
}

export function LatestUploadList({ posts }: LatestUploadListProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <div className="divide-y divide-border/80">
      {posts.map((post) => (
        <LatestUploadListItem key={post.href} post={post} />
      ))}
    </div>
  )
}

function LatestUploadListItem({ post }: { post: LatestUploadItem }) {
  return (
    <a
      href={post.href}
      className="group block p-5 transition-colors hover:bg-muted/45 sm:p-6"
    >
      <article>
        <div className="mb-5">
          <LatestUploadMeta category={post.category} meta={post.meta} />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-2">
            <h3 className="font-bold text-2xl leading-snug transition-colors group-hover:text-chart-2">
              {post.title}
            </h3>
            <p className="max-w-xl text-muted-foreground leading-7">
              {post.summary}
            </p>
          </div>
          <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
        </div>
      </article>
    </a>
  )
}
