import { NotebookPen } from "lucide-react"
import { PostList } from "@/widgets/post/post-list"
import { PostListHeader } from "@/widgets/post/post-list-header"

type LogArchiveItem = {
  id: string
  title: string
  slug: string
  subtitle: string | null
  publishedAt: Date | null
  createdAt: Date
}

type LogViewProps = {
  posts: readonly LogArchiveItem[]
}

export function LogView({ posts }: LogViewProps) {
  const listPosts = posts.map((post) => ({
    ...post,
    href: `/log/${post.slug}`,
  }))

  return (
    <div className="grid w-full gap-6">
      <PostListHeader
        icon={NotebookPen}
        eyebrow="debug notes"
        title="Log"
        description="개발하다 마주친 현상, 작은 팁, 에러 해결 과정을 짧게 붙잡아두는 기록입니다."
        meta={`공개된 로그 ${posts.length.toLocaleString("ko-KR")}개`}
      />

      <PostList
        posts={listPosts}
        ariaLabel="공개 로그 목록"
        emptyMessage="아직 공개된 로그가 없습니다. 발견한 현상과 해결 기록이 생기면 이곳에 쌓입니다."
      />
    </div>
  )
}
