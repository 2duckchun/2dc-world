import type { BlogPostSummary } from "@/domain/blog/model"
import { EmptyStateCard } from "@/widgets/blog/empty-state-card"
import { PostCard } from "@/widgets/blog/post-card"

type MemoListViewProps = {
  posts: BlogPostSummary[]
}

export function MemoListView({ posts }: MemoListViewProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-[2rem] border border-border/70 bg-card/70 p-8 shadow-sm sm:p-10">
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Public reading · Memo
        </span>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Dense notes for fast scanning.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground text-pretty sm:text-lg">
            MEMO keeps information density high while remaining readable on
            narrow, mobile-first layouts.
          </p>
        </div>
      </section>

      {posts.length === 0 ? (
        <EmptyStateCard
          eyebrow="Memo empty"
          title="No memos have been published yet."
          description="Quick notes will surface here once the first memo moves out of draft status in later phases."
          actionHref="/blog"
          actionLabel="Browse blog posts"
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <PostCard key={post.id} animationDelayMs={index * 55} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
