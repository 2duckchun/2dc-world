import {
  ArrowLeft,
  ArrowRight,
  MessageSquareMore,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import type { BlogPostDetail } from "@/domain/blog/model"
import { blogPostTypeMeta, getPostRoute } from "@/domain/blog/model"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"
import { MarkdownContent } from "@/shared/ui/markdown-content"
import { PostDetailHeader } from "@/widgets/blog/post-detail-header"

type PostDetailViewProps = {
  post: BlogPostDetail
}

export function PostDetailView({ post }: PostDetailViewProps) {
  const meta = blogPostTypeMeta[post.type]

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <PostDetailHeader post={post} />

      <article className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8">
        <MarkdownContent markdown={post.contentMarkdown} />
      </article>

      <section className="rounded-[2rem] border border-dashed border-border/80 bg-card/70 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              <Sparkles className="size-3.5" />
              Reserved for phase 3
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-balance">
              Likes and comments will land here later.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground text-pretty sm:text-base">
              Public reading stays intentionally calm in Phase 1. Interaction
              widgets are placeholder-only for now so the layout is ready
              without introducing unfinished behavior.
            </p>
          </div>
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageSquareMore className="size-5" />
          </div>
        </div>
      </section>

      {(post.previousPost || post.nextPost) && (
        <section className="grid gap-4 md:grid-cols-2">
          {post.previousPost ? (
            <Link
              href={getPostRoute(
                post.previousPost.type,
                post.previousPost.slug,
              )}
              className="rounded-[1.7rem] border border-border/70 bg-card/80 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  <ArrowLeft className="size-3.5" />
                  {post.navigationMode === "series"
                    ? "Previous chapter"
                    : "Newer post"}
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-balance">
                  {post.previousPost.title}
                </h3>
                {post.previousPost.chapterLabel ? (
                  <p className="text-sm text-muted-foreground">
                    {post.previousPost.chapterLabel}
                  </p>
                ) : null}
              </div>
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}

          {post.nextPost ? (
            <Link
              href={getPostRoute(post.nextPost.type, post.nextPost.slug)}
              className="rounded-[1.7rem] border border-border/70 bg-card/80 p-5 text-right shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  {post.navigationMode === "series"
                    ? "Next chapter"
                    : "Older post"}
                  <ArrowRight className="size-3.5" />
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-balance">
                  {post.nextPost.title}
                </h3>
                {post.nextPost.chapterLabel ? (
                  <p className="text-sm text-muted-foreground">
                    {post.nextPost.chapterLabel}
                  </p>
                ) : null}
              </div>
            </Link>
          ) : null}
        </section>
      )}

      <div className="flex justify-center">
        <Link
          href={`/${meta.segment}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "rounded-full",
          )}
        >
          Back to {meta.label}
        </Link>
      </div>
    </div>
  )
}
