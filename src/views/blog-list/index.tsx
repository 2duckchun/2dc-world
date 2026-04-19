import type { BlogPostSummary } from "@/domain/blog/model"
import { EmptyStateCard } from "@/widgets/blog/empty-state-card"
import { PostCard } from "@/widgets/blog/post-card"

type BlogListViewProps = {
  posts: BlogPostSummary[]
}

export function BlogListView({ posts }: BlogListViewProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-[2rem] border border-border/70 bg-card/70 p-8 shadow-sm sm:p-10">
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Public reading · Blog
        </span>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Essays with enough room to breathe.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground text-pretty sm:text-lg">
            BLOG posts prioritize rhythm, whitespace, and clear server-rendered
            detail pages for durable reading and SEO.
          </p>
        </div>
      </section>

      {posts.length === 0 ? (
        <EmptyStateCard
          eyebrow="Blog empty"
          title="No blog posts are published yet."
          description="The public reading flow is ready — the first long-form post will appear here as soon as it is published."
          actionHref="/memo"
          actionLabel="Browse memos instead"
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {posts.map((post, index) => (
            <PostCard key={post.id} animationDelayMs={index * 70} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
