import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import {
  type BlogPostSummary,
  blogPostTypeMeta,
  getBooklogSeriesRoute,
  getPostRoute,
} from "@/domain/blog/model"
import { cn } from "@/shared/lib/utils"
import { PostMetaLine } from "@/widgets/blog/post-meta-line"
import { TagList } from "@/widgets/blog/tag-list"

type PostCardProps = {
  post: BlogPostSummary
  animationDelayMs?: number
  className?: string
}

const cardStyles = {
  BLOG: "rounded-[1.9rem] border border-border/70 bg-card/80 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:p-7",
  MEMO: "rounded-[1.6rem] border border-border/70 bg-card/70 p-5 shadow-sm transition-all hover:border-primary/20 hover:bg-card hover:shadow-lg",
  BOOKLOG:
    "rounded-[1.9rem] border border-border/70 bg-linear-to-br from-card via-card to-primary/5 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:p-7",
} as const

export function PostCard({
  post,
  animationDelayMs = 0,
  className,
}: PostCardProps) {
  const meta = blogPostTypeMeta[post.type]
  const seriesLabel = post.series
    ? `${post.series.title} · ${post.series.chapterLabel ?? `Part ${post.series.orderIndex}`}`
    : null

  return (
    <article
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 fill-mode-both",
        cardStyles[post.type],
        className,
      )}
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <div className="flex h-full flex-col gap-5">
        <div className="space-y-3">
          <div className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase shadow-sm">
            {meta.eyebrow}
          </div>
          <div className="space-y-3">
            {post.series ? (
              <Link
                href={getBooklogSeriesRoute(post.series.slug)}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
              >
                {post.series.title}
              </Link>
            ) : null}
            <h2
              className={cn(
                "font-semibold tracking-tight text-balance text-foreground",
                post.type === "MEMO"
                  ? "text-xl sm:text-2xl"
                  : "text-2xl sm:text-3xl",
              )}
            >
              <Link
                href={getPostRoute(post.type, post.slug)}
                className="transition-colors hover:text-primary"
              >
                {post.title}
              </Link>
            </h2>
            <p className="text-sm leading-7 text-muted-foreground text-pretty sm:text-base">
              {post.summary}
            </p>
          </div>
        </div>

        <PostMetaLine
          compact={post.type === "MEMO"}
          publishedAt={post.publishedAt}
          readingMinutes={post.readingMinutes}
          seriesLabel={seriesLabel}
          type={post.type}
        />

        <div className="mt-auto flex flex-col gap-4 border-t border-border/70 pt-4">
          <TagList tagNames={post.tagNames} />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
              Open the entry
            </span>
            <Link
              href={getPostRoute(post.type, post.slug)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Read {meta.label}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
