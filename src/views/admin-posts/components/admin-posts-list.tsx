"use client"

import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { AdminPostListCard } from "./admin-post-list-card"

export function AdminPostsList() {
  const router = useRouter()
  const trpc = useTRPC()
  const { data: posts } = useSuspenseQuery(
    trpc.post.listForAdmin.queryOptions(),
  )
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
        <ul className="divide-y divide-border/80">
          {posts.map((post) => (
            <AdminPostListCard
              key={post.id}
              post={post}
              isArchivePending={archivePost.isPending}
              onArchive={(postId) => {
                const confirmed = window.confirm(
                  "이 게시글을 Archived 상태로 변경할까요?",
                )
                if (!confirmed) {
                  return
                }
                archivePost.mutate({ id: postId })
              }}
            />
          ))}
        </ul>
      ) : (
        <div className="flex min-h-60 items-center p-5 text-muted-foreground sm:p-7">
          아직 작성된 게시글이 없습니다.
        </div>
      )}
    </section>
  )
}
