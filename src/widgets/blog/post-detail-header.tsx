import { ArrowLeft, ArrowUpRight, Layers3 } from "lucide-react"
import Link from "next/link"
import {
  type BlogPostDetail,
  blogPostTypeMeta,
  getBooklogSeriesRoute,
} from "@/domain/blog/model"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"
import { PostMetaLine } from "@/widgets/blog/post-meta-line"
import { TagList } from "@/widgets/blog/tag-list"

type PostDetailHeaderProps = {
  post: BlogPostDetail
}

export function PostDetailHeader({ post }: PostDetailHeaderProps) {
  const meta = blogPostTypeMeta[post.type]
  const seriesLabel = post.series
    ? `${post.series.title} · ${post.series.chapterLabel ?? `Part ${post.series.orderIndex}`}`
    : null

  return (
    <header className="space-y-6 rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/${meta.segment}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "rounded-full",
          )}
        >
          <ArrowLeft className="size-4" />
          Back to {meta.label}
        </Link>
        {post.series ? (
          <Link
            href={getBooklogSeriesRoute(post.series.slug)}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
          >
            <Layers3 className="size-4" />
            View series
            <ArrowUpRight className="size-4" />
          </Link>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase shadow-sm">
          {meta.eyebrow}
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {post.title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground text-pretty sm:text-lg">
            {post.summary}
          </p>
        </div>
      </div>

      <PostMetaLine
        className="pt-1"
        publishedAt={post.publishedAt}
        readingMinutes={post.readingMinutes}
        seriesLabel={seriesLabel}
        type={post.type}
      />

      <TagList tagNames={post.tagNames} />
    </header>
  )
}
