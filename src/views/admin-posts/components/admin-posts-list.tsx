"use client"

import { useMutation } from "@tanstack/react-query"
import { Archive, ArrowUpRight, FilePenLine } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { postKindLabels, postStatusLabels } from "@/domain/content/types"
import type { PostListForAdminOutput } from "@/domain/post/procedure/get-list-for-admin/schema"
import { Button, buttonVariants } from "@/shared/ui/button"

type AdminPostListItem = PostListForAdminOutput[number]

type AdminPostsListProps = {
  posts: PostListForAdminOutput
}

const kstOffsetMilliseconds = 9 * 60 * 60 * 1000

const formatKoreanDateTime = (date: Date) => {
  const kstDate = new Date(date.getTime() + kstOffsetMilliseconds)
  const year = kstDate.getUTCFullYear()
  const month = kstDate.getUTCMonth() + 1
  const day = kstDate.getUTCDate()
  const hours = kstDate.getUTCHours()
  const minutes = kstDate.getUTCMinutes().toString().padStart(2, "0")
  const period = hours < 12 ? "오전" : "오후"
  const displayHours = hours % 12 || 12

  return `${year}. ${month}. ${day}. ${period} ${displayHours}:${minutes}`
}

const getPublishedHref = (post: AdminPostListItem) => {
  if (post.status !== "published") {
    return null
  }

  if (post.kind === "log") {
    return `/log/${post.slug}`
  }

  if (post.kind === "series") {
    return post.series ? `/series/${post.series.slug}/${post.slug}` : null
  }

  return `/posts/${post.slug}`
}

const getSeriesLabel = (post: AdminPostListItem) => {
  if (!post.series) {
    return "없음"
  }

  if (post.seriesOrder === null) {
    return post.series.title
  }

  return `${post.series.title} · ${post.seriesOrder}회차`
}

export function AdminPostsList({ posts }: AdminPostsListProps) {
  const router = useRouter()
  const trpc = useTRPC()
  const archivePost = useMutation(
    trpc.post.archive.mutationOptions({
      onSuccess: () => {
        toast.success("게시글을 Archived 상태로 변경했습니다.")
        router.refresh()
      },
      onError: (error) => {
        toast.error(error.message || "게시글 삭제에 실패했습니다.")
      },
    }),
  )

  return (
    <section
      aria-label="게시글 목록"
      className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
    >
      {posts.length > 0 ? (
        <div className="divide-y divide-border/80">
          {posts.map((post) => {
            const publishedHref = getPublishedHref(post)

            return (
              <article key={post.id} className="grid gap-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="grid min-w-0 gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
                      <span>{postKindLabels[post.kind]}</span>
                      <span aria-hidden="true">/</span>
                      <span>{postStatusLabels[post.status]}</span>
                      <span aria-hidden="true">/</span>
                      <span className="truncate">{getSeriesLabel(post)}</span>
                    </div>
                    <h2 className="font-bold text-2xl leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      수정 {formatKoreanDateTime(post.updatedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {publishedHref ? (
                      <a
                        href={publishedHref}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        <ArrowUpRight
                          data-icon="inline-start"
                          className="size-3.5"
                        />
                        공개
                      </a>
                    ) : null}
                    <a
                      href={`/admin/posts/${post.id}/edit`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      <FilePenLine
                        data-icon="inline-start"
                        className="size-3.5"
                      />
                      수정
                    </a>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={
                        post.status === "archived" || archivePost.isPending
                      }
                      onClick={() => {
                        const confirmed = window.confirm(
                          "이 게시글을 Archived 상태로 변경할까요?",
                        )

                        if (!confirmed) {
                          return
                        }

                        archivePost.mutate({ id: post.id })
                      }}
                    >
                      <Archive data-icon="inline-start" className="size-3.5" />
                      삭제
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="flex min-h-60 items-center p-5 text-muted-foreground sm:p-7">
          아직 작성된 게시글이 없습니다.
        </div>
      )}
    </section>
  )
}
