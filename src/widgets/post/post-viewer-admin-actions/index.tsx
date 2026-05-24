"use client"

import { useMutation } from "@tanstack/react-query"
import { Archive, FilePenLine } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { Button, buttonVariants } from "@/shared/ui/button"
import { AppRoutes } from "@/shared/utils/app-routes"

type PostViewerAdminActionsProps = {
  postId: string
  listHref: string
}

export function PostViewerAdminActions({
  postId,
  listHref,
}: PostViewerAdminActionsProps) {
  const router = useRouter()
  const trpc = useTRPC()
  const archivePost = useMutation(
    trpc.post.archive.mutationOptions({
      onSuccess: () => {
        toast.success("글을 보관함으로 옮겼습니다.")
        router.push(listHref)
        router.refresh()
      },
      onError: (error) => {
        toast.error(error.message || "글 삭제에 실패했습니다.")
      },
    }),
  )

  const handleDelete = () => {
    const confirmed = window.confirm("이 글을 보관함으로 옮길까요?")
    if (!confirmed) {
      return
    }
    archivePost.mutate({ id: postId })
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={AppRoutes.admin.posts.edit(postId)}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <FilePenLine data-icon="inline-start" className="size-3.5" />
        수정
      </Link>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={archivePost.isPending}
        onClick={handleDelete}
      >
        <Archive data-icon="inline-start" className="size-3.5" />
        {archivePost.isPending ? "삭제 중" : "삭제"}
      </Button>
    </div>
  )
}
