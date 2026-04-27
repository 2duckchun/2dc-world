import { ArrowUpRight, CalendarDays, LibraryBig } from "lucide-react"

type PostArchiveItem = {
  id: string
  title: string
  slug: string
  subtitle: string | null
  publishedAt: Date | null
  createdAt: Date
}

type PostsViewProps = {
  posts: readonly PostArchiveItem[]
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
})

export function PostsView({ posts }: PostsViewProps) {
  return (
    <div className="grid w-full gap-6">
      <header className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-background">
            <LibraryBig className="size-4 text-chart-3" />
          </span>
          <span>published posts</span>
        </div>
        <div className="grid gap-3">
          <h1 className="text-balance font-black text-4xl leading-tight sm:text-5xl">
            Posts
          </h1>
          <p className="max-w-3xl text-muted-foreground text-lg leading-8">
            긴 호흡의 글만 모아둔 공개 아카이브입니다. 최신 글부터 천천히
            훑어보세요.
          </p>
        </div>
        <p className="font-medium text-muted-foreground text-sm">
          공개된 글 {posts.length.toLocaleString("ko-KR")}개
        </p>
      </header>

      <section
        aria-label="공개 글 목록"
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
                  href={`/posts/${post.slug}`}
                  className="group block p-5 transition-colors hover:bg-muted/45 sm:p-6"
                >
                  <article className="grid gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-4" />
                        {displayDate}
                      </span>
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
            아직 공개된 글이 없습니다. 첫 글이 올라오면 이곳에 차곡차곡
            쌓입니다.
          </div>
        )}
      </section>
    </div>
  )
}
