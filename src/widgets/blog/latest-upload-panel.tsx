import { ArrowUpRight, Clock3 } from "lucide-react"
import type { CSSProperties } from "react"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"

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
  href: string
  actionLabel: string
  spotlight: LatestUploadItem | null
  posts: readonly LatestUploadItem[]
  className?: string
  style?: CSSProperties
}

export function LatestUploadPanel({
  eyebrow,
  title,
  titleId,
  href,
  actionLabel,
  spotlight,
  posts,
  className,
  style,
}: LatestUploadPanelProps) {
  return (
    <section
      className={cn(
        "story-rail animate-rise overflow-hidden rounded-lg border border-border bg-card shadow-sm",
        className,
      )}
      style={style}
      aria-labelledby={titleId}
    >
      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-border border-b p-5 sm:p-7 lg:border-r lg:border-b-0">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-muted-foreground text-sm">{eyebrow}</p>
              <h2 id={titleId} className="mt-2 font-bold text-2xl">
                {title}
              </h2>
            </div>
            <a
              href={href}
              aria-label={actionLabel}
              className={buttonVariants({
                variant: "ghost",
                size: "icon-lg",
              })}
            >
              <ArrowUpRight className="size-5" />
            </a>
          </div>

          {spotlight ? (
            <a href={spotlight.href} className="group block">
              <article className="space-y-5">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-lg bg-chart-2/12 px-2.5 py-1 font-medium text-chart-2">
                    {spotlight.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Clock3 className="size-4" />
                    {spotlight.meta}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <h3 className="max-w-xl text-balance font-black text-3xl leading-tight transition-colors group-hover:text-chart-2 sm:text-4xl">
                      {spotlight.title}
                    </h3>
                    <p className="max-w-2xl text-muted-foreground leading-7">
                      {spotlight.summary}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-2 size-6 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
              </article>
            </a>
          ) : (
            <div className="flex min-h-40 items-center text-muted-foreground">
              아직 공개된 글이 없습니다.
            </div>
          )}
        </div>

        <div className="divide-y divide-border/80">
          {posts.length > 0 ? (
            posts.map((post) => (
              <a
                key={post.href}
                href={post.href}
                className="group block p-5 transition-colors hover:bg-muted/45 sm:p-7"
              >
                <article>
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-lg bg-chart-2/12 px-2.5 py-1 font-medium text-chart-2">
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Clock3 className="size-4" />
                      {post.meta}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl leading-snug">
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
            ))
          ) : (
            <div className="flex min-h-56 items-center p-5 text-muted-foreground sm:p-7">
              {spotlight
                ? "다음 글이 올라오면 여기에 표시됩니다."
                : "공개된 글이 생기면 여기에 표시됩니다."}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
