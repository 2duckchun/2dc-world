import { ArrowUpRight, Clock3, ListOrdered } from "lucide-react"
import Link from "next/link"
import {
  type BooklogSeriesSummary,
  getBooklogSeriesRoute,
  getPostRoute,
} from "@/domain/blog/model"
import { formatPublishedDate } from "@/shared/lib/format-date"

type SeriesListBlockProps = {
  series: BooklogSeriesSummary[]
  title?: string
  description?: string
}

export function SeriesListBlock({
  series,
  title = "Booklog series",
  description = "Move through longer reading arcs in the intended order.",
}: SeriesListBlockProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Ordered reading
          </span>
          <div className="space-y-1">
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              {title}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground text-pretty sm:text-base">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {series.map((item, index) => (
          <article
            key={item.slug}
            className="animate-in fade-in-0 slide-in-from-bottom-4 rounded-[1.9rem] border border-border/70 bg-card/80 p-6 shadow-sm duration-700 fill-mode-both"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="flex h-full flex-col gap-5">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 shadow-sm">
                    <ListOrdered className="size-3.5" />
                    {item.postCount} chapters
                  </span>
                  {item.latestPublishedAt ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 shadow-sm normal-case tracking-normal text-[0.8rem]">
                      <Clock3 className="size-3.5" />
                      Updated {formatPublishedDate(item.latestPublishedAt)}
                    </span>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold tracking-tight text-balance">
                    <Link
                      href={getBooklogSeriesRoute(item.slug)}
                      className="transition-colors hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground text-pretty sm:text-base">
                    {item.description ||
                      "A calm sequence of notes to read in order."}
                  </p>
                </div>
              </div>

              <ol className="space-y-2 rounded-2xl border border-border/70 bg-background/70 p-4">
                {item.previewPosts.map((post) => (
                  <li
                    key={post.slug}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                      {post.orderIndex}
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <Link
                        href={getPostRoute("BOOKLOG", post.slug)}
                        className="font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {post.title}
                      </Link>
                      <p className="text-muted-foreground">
                        {post.chapterLabel ?? `Chapter ${post.orderIndex}`}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-auto flex items-center justify-end">
                <Link
                  href={getBooklogSeriesRoute(item.slug)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  View series
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
