import { ArrowLeft, ArrowUpRight, BookOpenText, Layers3 } from "lucide-react"
import Link from "next/link"
import type { BooklogSeriesDetail } from "@/domain/blog/model"
import { getPostRoute } from "@/domain/blog/model"
import { formatPublishedDate } from "@/shared/lib/format-date"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"
import { TagList } from "@/widgets/blog/tag-list"

type BooklogSeriesDetailViewProps = {
  series: BooklogSeriesDetail
}

export function BooklogSeriesDetailView({
  series,
}: BooklogSeriesDetailViewProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-border/70 bg-linear-to-br from-card via-card to-primary/10 p-8 shadow-sm sm:p-10">
        <div className="space-y-5">
          <Link
            href="/booklog"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full",
            )}
          >
            <ArrowLeft className="size-4" />
            Back to Booklog
          </Link>
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              <Layers3 className="size-3.5" />
              Ordered series
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {series.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground text-pretty sm:text-lg">
              {series.description || "A connected sequence of booklog notes."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 shadow-sm">
              {series.postCount} chapters
            </span>
            {series.latestPublishedAt ? (
              <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 shadow-sm">
                Updated {formatPublishedDate(series.latestPublishedAt)}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            Read in order
          </h2>
          <p className="text-sm leading-7 text-muted-foreground text-pretty sm:text-base">
            Each entry keeps its place in the sequence so the flow is visible at
            a glance.
          </p>
        </div>

        <ol className="relative space-y-4 before:absolute before:top-0 before:bottom-0 before:left-[1.3rem] before:w-px before:bg-border/80">
          {series.posts.map((post, index) => (
            <li key={post.slug} className="relative pl-12">
              <span className="absolute top-5 left-0 inline-flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 font-semibold text-primary shadow-sm">
                {post.orderIndex}
              </span>
              <article
                className="animate-in fade-in-0 slide-in-from-bottom-4 rounded-[1.7rem] border border-border/70 bg-card/80 p-5 shadow-sm duration-700 fill-mode-both transition-all hover:-translate-y-1 hover:shadow-lg sm:p-6"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="flex h-full flex-col gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 shadow-sm">
                        <BookOpenText className="size-3.5" />
                        {post.chapterLabel ?? `Chapter ${post.orderIndex}`}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-2.5 py-1 shadow-sm normal-case tracking-normal text-[0.8rem]">
                        {formatPublishedDate(post.publishedAt)}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-2.5 py-1 shadow-sm normal-case tracking-normal text-[0.8rem]">
                        {post.readingMinutes} min read
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight text-balance">
                      <Link
                        href={getPostRoute("BOOKLOG", post.slug)}
                        className="transition-colors hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-sm leading-7 text-muted-foreground text-pretty sm:text-base">
                      {post.summary}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-col gap-4 border-t border-border/70 pt-4">
                    <TagList tagNames={post.tagNames} />
                    <div className="flex justify-end">
                      <Link
                        href={getPostRoute("BOOKLOG", post.slug)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
                      >
                        Read entry
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
