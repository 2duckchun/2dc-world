import Link from "next/link"
import { postKindLabels } from "@/domain/content/types"
import { TagLabel } from "@/shared/ui/tag-chip"
import type { HomeContentPost } from "@/views/home/sections/home-content-explorer-section/components/home-content-explorer"

type HomeContentListProps = {
  posts: readonly HomeContentPost[]
  ariaLabel: string
  emptyMessage: string
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
})

export function HomeContentList({
  posts,
  ariaLabel,
  emptyMessage,
}: HomeContentListProps) {
  if (posts.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">{emptyMessage}</p>
    )
  }

  return (
    <ul aria-label={ariaLabel} className="divide-y divide-border">
      {posts.map((post) => {
        const publishedAt = new Date(post.publishedAt ?? post.createdAt)

        return (
          <li key={post.id}>
            {/* sm 이상에서는 왼쪽 1칸을 hover 커서(▶) 자리로 비워 둔다. hover가 없는 모바일에서는 두지 않는다. */}
            <Link
              href={post.href}
              className="group grid gap-x-2 py-4 sm:grid-cols-[1rem_1fr]"
            >
              <span
                aria-hidden="true"
                className="invisible hidden text-point group-hover:visible group-focus-visible:visible sm:col-start-1 sm:row-start-2 sm:block"
              >
                ▶
              </span>
              <p className="sm:col-start-2 flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground">
                <span className="text-foreground uppercase">
                  [{postKindLabels[post.kind]}]
                </span>
                <time dateTime={publishedAt.toISOString()}>
                  {dateFormatter.format(publishedAt)}
                </time>
                {post.tags.map((tag) => (
                  <TagLabel key={tag.id}>#{tag.name}</TagLabel>
                ))}
              </p>
              <h3 className="sm:col-start-2 group-hover:text-point">
                {post.title}
              </h3>
              <p className="font-reading text-muted-foreground text-reading-sm sm:col-start-2">
                {post.subtitle ?? "요약이 준비 중입니다."}
              </p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
