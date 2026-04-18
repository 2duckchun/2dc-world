import Link from "next/link"
import type { PublishedPostSummary } from "@/domain/blog/lib/contracts"
import { PostMetaLine } from "@/widgets/post-meta-line/post-meta-line"

type PostCardProps = {
  item: PublishedPostSummary
}

export function PostCard({ item }: PostCardProps) {
  return (
    <article className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40">
      <div className="space-y-4">
        <div className="space-y-2">
          <Link href={item.href} className="group inline-block">
            <h2 className="text-2xl font-semibold tracking-tight group-hover:text-primary">
              {item.title}
            </h2>
          </Link>
          {item.summary ? (
            <p className="text-sm leading-7 text-muted-foreground">
              {item.summary}
            </p>
          ) : null}
        </div>

        <PostMetaLine item={item} />
      </div>
    </article>
  )
}
