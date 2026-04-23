import { ArrowUpRight, Braces, Clock3 } from "lucide-react"
import type { CSSProperties } from "react"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"

export type LatestUploadItem = {
  title: string
  category: string
  summary: string
  meta: string
}

type FeaturedUpload = {
  label: string
  title: string
  description: string
}

type LatestUploadPanelProps = {
  eyebrow: string
  title: string
  titleId: string
  href: string
  actionLabel: string
  featured: FeaturedUpload
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
  featured,
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

          <article className="space-y-5">
            <div className="flex w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 py-1 text-sm">
              <Braces className="size-4 text-chart-1" />
              {featured.label}
            </div>
            <h3 className="max-w-xl text-balance font-black text-3xl leading-tight sm:text-4xl">
              {featured.title}
            </h3>
            <p className="max-w-2xl text-muted-foreground leading-7">
              {featured.description}
            </p>
          </article>
        </div>

        <div className="divide-y divide-border/80">
          {posts.map((post) => (
            <article
              key={post.title}
              className="group p-5 transition-colors hover:bg-muted/45 sm:p-7"
            >
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
                <ArrowUpRight className="mt-1 size-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
