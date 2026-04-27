import { ArrowUpRight, CalendarDays } from "lucide-react"

export type PostListItem = {
  id: string
  title: string
  href: string
  subtitle: string | null
  publishedAt: Date | null
  createdAt: Date
  tags?: readonly {
    id: string
    name: string
    slug: string
  }[]
}

type PostListProps = {
  posts: readonly PostListItem[]
  ariaLabel: string
  emptyMessage: string
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
})

export const PostList = ({ posts, ariaLabel, emptyMessage }: PostListProps) => {
  return (
    <section
      aria-label={ariaLabel}
      className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
    >
      {posts.length > 0 ? (
        <div className="divide-y divide-border/80">
          {posts.map((post) => {
            const displayDate = dateFormatter.format(
              post.publishedAt ?? post.createdAt,
            )

            return (
              <a
                key={post.id}
                href={post.href}
                className="group block p-5 transition-colors hover:bg-muted/45 sm:p-6"
              >
                <article className="grid gap-3">
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-4" />
                      {displayDate}
                    </span>
                    {post.tags?.length ? (
                      <span className="flex min-w-0 flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex max-w-40 items-center rounded-lg border border-border bg-background px-2 py-0.5 text-muted-foreground"
                          >
                            <span className="truncate">#{tag.name}</span>
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid gap-2">
                      <h2 className="font-bold text-2xl leading-snug transition-colors group-hover:text-chart-3">
                        {post.title}
                      </h2>
                      <p className="max-w-3xl text-muted-foreground leading-7">
                        {post.subtitle ?? "요약이 준비 중입니다."}
                      </p>
                    </div>
                    <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
                  </div>
                </article>
              </a>
            )
          })}
        </div>
      ) : (
        <div className="flex min-h-60 items-center p-5 text-muted-foreground sm:p-7">
          {emptyMessage}
        </div>
      )}
    </section>
  )
}
