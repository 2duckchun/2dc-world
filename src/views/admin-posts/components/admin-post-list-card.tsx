import { Archive, ArrowUpRight, FilePenLine } from "lucide-react"
import Link from "next/link"
import {
  type PostKind,
  type PostStatus,
  postKindLabels,
  postStatusLabels,
} from "@/domain/content/types"
import { Button, buttonVariants } from "@/shared/ui/button"
import { AppRoutes } from "@/shared/utils/app-routes"

export type AdminPostListItem = {
  id: string
  title: string
  slug: string
  kind: PostKind
  status: PostStatus
  seriesOrder: number | null
  updatedAt: Date | string
  series: {
    title: string
    slug: string
  } | null
}

type AdminPostListCardProps = {
  post: AdminPostListItem
  isArchivePending: boolean
  onArchive: (postId: string) => void
}

const kstOffsetMilliseconds = 9 * 60 * 60 * 1000

const formatKoreanDateTime = (date: Date | string) => {
  const sourceDate = typeof date === "string" ? new Date(date) : date
  const kstDate = new Date(sourceDate.getTime() + kstOffsetMilliseconds)
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
    return AppRoutes.log.post(post.slug)
  }

  if (post.kind === "series") {
    return post.series
      ? AppRoutes.series.post(post.series.slug, post.slug)
      : null
  }

  return AppRoutes.posts.post(post.slug)
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

export function AdminPostListCard({
  post,
  isArchivePending,
  onArchive,
}: AdminPostListCardProps) {
  const publishedHref = getPublishedHref(post)

  return (
    <li className="grid gap-4 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid min-w-0 gap-2">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
            <span>{postKindLabels[post.kind]}</span>
            <span aria-hidden="true">/</span>
            <span>{postStatusLabels[post.status]}</span>
            <span aria-hidden="true">/</span>
            <span className="truncate">{getSeriesLabel(post)}</span>
          </div>
          <h2 className="font-bold text-2xl leading-snug">{post.title}</h2>
          <p className="text-muted-foreground text-sm">
            수정 {formatKoreanDateTime(post.updatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {publishedHref ? (
            <Link
              href={publishedHref}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
              })}
            >
              <ArrowUpRight data-icon="inline-start" className="size-3.5" />
              공개
            </Link>
          ) : null}
          <Link
            href={AppRoutes.admin.posts.edit(post.id)}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
            })}
          >
            <FilePenLine data-icon="inline-start" className="size-3.5" />
            수정
          </Link>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={post.status === "archived" || isArchivePending}
            onClick={() => onArchive(post.id)}
          >
            <Archive data-icon="inline-start" className="size-3.5" />
            삭제
          </Button>
        </div>
      </div>
    </li>
  )
}
