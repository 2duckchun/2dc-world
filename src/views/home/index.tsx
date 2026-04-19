import { ArrowRight, BookOpen, Library, Notebook } from "lucide-react"
import Link from "next/link"
import type { BlogPostSummary, BooklogSeriesSummary } from "@/domain/blog/model"
import { getBooklogSeriesRoute } from "@/domain/blog/model"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"
import { PostCard } from "@/widgets/blog/post-card"
import { SeriesListBlock } from "@/widgets/blog/series-list-block"

type HomeViewProps = {
  blogPosts: BlogPostSummary[]
  memoPosts: BlogPostSummary[]
  booklogPosts: BlogPostSummary[]
  series: BooklogSeriesSummary[]
}

const categoryCards = [
  {
    href: "/blog",
    title: "Blog",
    description:
      "Long-form essays with space to slow down and stay with the argument.",
    icon: BookOpen,
  },
  {
    href: "/memo",
    title: "Memo",
    description:
      "Short, denser notes for quick scanning and fast context recovery.",
    icon: Notebook,
  },
  {
    href: "/booklog",
    title: "Booklog",
    description:
      "Reading notes that can stand alone or connect into navigable series.",
    icon: Library,
  },
] as const

export function HomeView({
  blogPosts,
  memoPosts,
  booklogPosts,
  series,
}: HomeViewProps) {
  const latestSections = [
    { title: "Latest blog", href: "/blog", posts: blogPosts },
    { title: "Fresh memo", href: "/memo", posts: memoPosts },
    { title: "Recent booklog", href: "/booklog", posts: booklogPosts },
  ] as const

  return (
    <div className="space-y-16 pb-4">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-linear-to-br from-card via-card to-primary/10 p-8 shadow-sm sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_38%)]" />
        <div className="relative space-y-6">
          <span className="inline-flex animate-in fade-in-0 items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase duration-700">
            Phase 1 public reading
          </span>
          <div className="max-w-4xl space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Stories, memos, and booklogs — now readable without signing in.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground text-pretty sm:text-lg">
              The reading surface is live first: browse polished essays, skim
              quick memos, and follow booklog series in order. Backend read
              models, metadata, and public routes are wired to support the next
              phases.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/blog"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
            >
              Start with Blog
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/booklog"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full",
              )}
            >
              Explore Booklogs
            </Link>
            {series[0] ? (
              <Link
                href={getBooklogSeriesRoute(series[0].slug)}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "rounded-full",
                )}
              >
                Follow a Series
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {categoryCards.map((item, index) => {
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="animate-in fade-in-0 slide-in-from-bottom-4 rounded-[1.8rem] border border-border/70 bg-card/80 p-6 shadow-sm transition-all duration-700 fill-mode-both hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex h-full flex-col gap-4">
                <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {item.title}
                  </h2>
                  <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                    {item.description}
                  </p>
                </div>
                <div className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  Open {item.title}
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </Link>
          )
        })}
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase shadow-sm">
            Freshly published
          </span>
          <div className="space-y-1">
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              Move by mood, not by login state.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground text-pretty sm:text-base">
              Each surface is tuned differently: roomy for BLOG, denser for
              MEMO, and order-aware for BOOKLOG.
            </p>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-3">
          {latestSections.map((section) => (
            <section key={section.href} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold tracking-tight">
                  {section.title}
                </h3>
                <Link
                  href={section.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  See all
                </Link>
              </div>
              <div className="space-y-4">
                {section.posts.slice(0, 2).map((post, index) => (
                  <PostCard
                    key={post.id}
                    animationDelayMs={index * 90}
                    post={post}
                    className="h-full"
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      {series.length > 0 ? (
        <SeriesListBlock series={series.slice(0, 4)} />
      ) : null}
    </div>
  )
}
