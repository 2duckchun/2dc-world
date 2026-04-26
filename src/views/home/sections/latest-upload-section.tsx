import { trpcServerCaller } from "@/core/trpc/server/trpc-server-caller"
import { postKindLabels } from "@/domain/content/types"
import { animationDelay } from "@/shared/lib/animation"
import {
  type LatestUploadItem,
  LatestUploadPanel,
} from "@/widgets/blog/latest-upload-panel"

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
})

export async function LatestUploadSection() {
  const caller = await trpcServerCaller()
  const latestPosts = await caller.post.getLatestPosts({ limit: 3 })
  const latestUploads = latestPosts.map(
    (post) =>
      ({
        title: post.title,
        href: `/posts/${post.slug}`,
        category: postKindLabels[post.kind],
        summary: post.subtitle ?? "요약이 준비 중입니다.",
        meta: dateFormatter.format(post.publishedAt ?? post.createdAt),
      }) satisfies LatestUploadItem,
  )
  const [spotlight, ...listPosts] = latestUploads

  return (
    <LatestUploadPanel
      eyebrow="latest upload"
      title="최근에 올라온 글"
      titleId="home-latest-title"
      href="/posts"
      actionLabel="최근 글 모두 보기"
      spotlight={spotlight ?? null}
      posts={listPosts}
      style={animationDelay(130)}
    />
  )
}
