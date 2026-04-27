import { ArrowUpRight, Clock3 } from "lucide-react"
import type { CSSProperties } from "react"
import { cn } from "@/shared/lib/utils"

export type LatestUploadItem = {
  title: string
  href: string
  category: string
  summary: string
  meta: string
}

type LatestUploadPanelProps = {
  eyebrow: string
  title: string
  titleId: string
  spotlight: LatestUploadItem | null
  posts: readonly LatestUploadItem[]
  className?: string
  style?: CSSProperties
}

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

type LatestUploadHeaderProps = {
  eyebrow: string
  title: string
  titleId: string
}

function LatestUploadHeader({
  eyebrow,
  title,
  titleId,
}: LatestUploadHeaderProps) {
  return (
    <div className="border-border border-b p-5 sm:p-7">
      <div className="grid gap-2">
        <p className="font-mono text-muted-foreground text-sm">{eyebrow}</p>
        <h2 id={titleId} className="text-balance font-black text-3xl">
          {title}
        </h2>
      </div>
    </div>
  )
}

type LatestUploadBodyProps = {
  spotlight: LatestUploadItem | null
  posts: readonly LatestUploadItem[]
}

function LatestUploadBody({ spotlight, posts }: LatestUploadBodyProps) {
  const hasPosts = posts.length > 0

  return (
    <div className={cn("grid", hasPosts && "lg:grid-cols-[1.15fr_0.85fr]")}>
      <LatestUploadSpotlight spotlight={spotlight} hasPosts={hasPosts} />
      <LatestUploadList posts={posts} />
    </div>
  )
}

type LatestUploadSpotlightProps = {
  spotlight: LatestUploadItem | null
  hasPosts: boolean
}

function LatestUploadSpotlight({
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

function LatestUploadList({ posts }: { posts: readonly LatestUploadItem[] }) {
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

function LatestUploadMeta({
  category,
  meta,
}: Pick<LatestUploadItem, "category" | "meta">) {
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

function LatestUploadEmpty() {
  return (
    <div className="flex min-h-40 items-center text-muted-foreground">
      아직 공개된 글이 없습니다.
    </div>
  )
}
