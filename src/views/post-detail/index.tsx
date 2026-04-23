import { CalendarDays } from "lucide-react"
import { MarkdownContent } from "@/shared/ui/markdown-content"

type PostDetailViewProps = {
  post: {
    title: string
    subtitle: string | null
    content: string
    publishedAt: Date | null
    createdAt: Date
    series: {
      title: string
      slug: string
    } | null
  }
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
})

export function PostDetailView({ post }: PostDetailViewProps) {
  const displayDate = dateFormatter.format(post.publishedAt ?? post.createdAt)

  return (
    <div className="grid w-full gap-8">
      <header className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
          {post.series ? (
            <a
              href={`/series/${post.series.slug}`}
              className="rounded-md border border-border bg-background px-2.5 py-1 font-medium text-foreground transition hover:bg-muted"
            >
              {post.series.title}
            </a>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            {displayDate}
          </span>
        </div>
        <div className="grid gap-3">
          <h1 className="text-balance font-black text-4xl leading-tight sm:text-5xl">
            {post.title}
          </h1>
          {post.subtitle ? (
            <p className="max-w-3xl text-muted-foreground text-lg leading-8">
              {post.subtitle}
            </p>
          ) : null}
        </div>
      </header>

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-8">
        <MarkdownContent markdown={post.content} className="prose-lg" />
      </section>
    </div>
  )
}
