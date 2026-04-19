import type { BlogPostSummary } from "@/domain/blog/model"
import { EmptyStateCard } from "@/widgets/blog/empty-state-card"
import { PostCard } from "@/widgets/blog/post-card"

type TagPostsViewProps = {
  tagName: string
  posts: BlogPostSummary[]
}

export function TagPostsView({ tagName, posts }: TagPostsViewProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-[2rem] border border-border/70 bg-card/70 p-8 shadow-sm sm:p-10">
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Tag archive
        </span>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            #{tagName}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground text-pretty sm:text-lg">
            Mixed-type archive for a single public tag across BLOG, MEMO, and
            BOOKLOG.
          </p>
        </div>
      </section>

      {posts.length === 0 ? (
        <EmptyStateCard
          eyebrow="No public matches"
          title="This tag exists, but has no published posts yet."
          description="Once a public post carries this tag, it will appear here automatically."
          actionHref="/blog"
          actionLabel="Browse blog"
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {posts.map((post, index) => (
            <PostCard key={post.id} animationDelayMs={index * 65} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
