"use client"

import { useMutation } from "@tanstack/react-query"
import { FilePenLine, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { Button, buttonVariants } from "@/shared/ui/button"
import { AppRoutes } from "@/shared/utils/app-routes"

type SeriesViewerAdminActionsProps = {
  seriesId: string
  episodeCount: number
}

export function SeriesViewerAdminActions({
  seriesId,
  episodeCount,
}: SeriesViewerAdminActionsProps) {
  const router = useRouter()
  const trpc = useTRPC()
  const deleteSeries = useMutation(
    trpc.series.delete.mutationOptions({
      onSuccess: (result) => {
        if (result.deletedPostCount > 0) {
          toast.success(
            `시리즈와 연결된 ${result.deletedPostCount.toLocaleString("ko-KR")}개 글을 삭제했습니다.`,
          )
        } else {
          toast.success("시리즈를 삭제했습니다.")
        }
        router.push(AppRoutes.series.list())
        router.refresh()
      },
      onError: (error) => {
        toast.error(error.message || "시리즈 삭제에 실패했습니다.")
      },
    }),
  )

  const handleDelete = () => {
    const message =
      episodeCount > 0
        ? `이 시리즈와 연결된 ${episodeCount.toLocaleString("ko-KR")}개 글을 모두 삭제할까요? 이 작업은 되돌릴 수 없습니다.`
        : "이 시리즈를 삭제할까요?"
    const confirmed = window.confirm(message)
    if (!confirmed) {
      return
    }
    deleteSeries.mutate({ id: seriesId })
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={AppRoutes.admin.series.editAnchor(seriesId)}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <FilePenLine data-icon="inline-start" className="size-3.5" />
        수정
      </Link>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={deleteSeries.isPending}
        onClick={handleDelete}
      >
        <Trash2 data-icon="inline-start" className="size-3.5" />
        {deleteSeries.isPending ? "삭제 중" : "삭제"}
      </Button>
    </div>
  )
}
