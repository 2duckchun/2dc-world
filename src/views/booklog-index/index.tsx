import type { BlogPostSummary, BooklogSeriesSummary } from "@/domain/blog/model"
import { EmptyStateCard } from "@/widgets/blog/empty-state-card"
import { PostCard } from "@/widgets/blog/post-card"
import { SeriesListBlock } from "@/widgets/blog/series-list-block"

type BooklogIndexViewProps = {
  posts: BlogPostSummary[]
  series: BooklogSeriesSummary[]
}

export function BooklogIndexView({ posts, series }: BooklogIndexViewProps) {
  return (
    <div className="space-y-10">
      <section className="space-y-4 rounded-[2rem] border border-border/70 bg-linear-to-br from-card via-card to-primary/10 p-8 shadow-sm sm:p-10">
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Public reading · Booklog
        </span>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Read standalone notes or follow a full series.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground text-pretty sm:text-lg">
            Booklog emphasizes sequence. Series sit first, while newer
            standalone reading notes remain easy to discover below.
          </p>
        </div>
      </section>

      {series.length > 0 ? (
        <SeriesListBlock series={series} />
      ) : (
        <EmptyStateCard
          eyebrow="Series quiet"
          title="No public booklog series yet."
          description="Series-aware navigation is wired up. Once connected posts are published, their ordered reading flow will appear here."
        />
      )}

      <section className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            Latest booklogs
          </h2>
          <p className="text-sm leading-7 text-muted-foreground text-pretty sm:text-base">
            Newer book notes still show up even when they do not belong to a
            series.
          </p>
        </div>

        {posts.length === 0 ? (
          <EmptyStateCard
            eyebrow="Booklog empty"
            title="No booklog entries are public yet."
            description="The route and data model are ready. Public reading cards appear here when booklog posts are published."
            actionHref="/blog"
            actionLabel="Browse blog instead"
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                animationDelayMs={index * 70}
                post={post}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
