"use client"

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { Heart } from "lucide-react"
import { signInWithGitHub } from "@/core/auth/actions"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { cn } from "@/shared/lib/utils"

type LikeSectionProps = {
  postId: string
  isAuthenticated: boolean
}

const buttonClassName = cn(
  "inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm transition",
  "hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60",
)

export function LikeSection({ postId, isAuthenticated }: LikeSectionProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const queryOptions = trpc.like.getPostStats.queryOptions({ postId })
  const { data: stats } = useSuspenseQuery(queryOptions)
  const toggleLike = useMutation(
    trpc.like.togglePostLike.mutationOptions({
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: queryOptions.queryKey })
        const previous = queryClient.getQueryData(queryOptions.queryKey)

        queryClient.setQueryData(queryOptions.queryKey, (current) => {
          if (!current) {
            return current
          }

          const nextLiked = !current.likedByMe

          return {
            likedByMe: nextLiked,
            likeCount: nextLiked
              ? current.likeCount + 1
              : Math.max(0, current.likeCount - 1),
          }
        })

        return { previous }
      },
      onError: (_error, _variables, context) => {
        if (context?.previous) {
          queryClient.setQueryData(queryOptions.queryKey, context.previous)
        }
      },
      onSuccess: (data) => {
        queryClient.setQueryData(queryOptions.queryKey, {
          likedByMe: data.liked,
          likeCount: data.likeCount,
        })
      },
    }),
  )

  const heartIcon = (
    <Heart
      aria-hidden
      className={cn(
        "size-4 transition",
        stats.likedByMe && "fill-red-500 text-red-500",
      )}
    />
  )
  const countLabel = stats.likeCount.toLocaleString("ko-KR")

  if (!isAuthenticated) {
    return (
      <form action={signInWithGitHub}>
        <button
          type="submit"
          aria-label="좋아요 (로그인 필요)"
          className={buttonClassName}
        >
          {heartIcon}
          <span>{countLabel}</span>
        </button>
      </form>
    )
  }

  return (
    <button
      type="button"
      aria-pressed={stats.likedByMe}
      aria-label={stats.likedByMe ? "좋아요 취소" : "좋아요"}
      disabled={toggleLike.isPending}
      onClick={() => toggleLike.mutate({ postId })}
      className={buttonClassName}
    >
      {heartIcon}
      <span>{countLabel}</span>
    </button>
  )
}
