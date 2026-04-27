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

const getLatestUploadHref = (post: { kind: string; slug: string }) =>
  post.kind === "log" ? `/log/${post.slug}` : `/posts/${post.slug}`

export async function LatestUploadSection() {
  const caller = await trpcServerCaller()
  const latestPosts = await caller.post.getLatestPosts({ limit: 3 })
  const latestUploads = latestPosts.map(
    (post) =>
      ({
        title: post.title,
        href: getLatestUploadHref(post),
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
      spotlight={spotlight ?? null}
      posts={listPosts}
      style={animationDelay(130)}
    />
  )
}
