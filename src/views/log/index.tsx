import { NotebookPen } from "lucide-react"
import { PostListHeader } from "@/widgets/post/post-list-header"
import { PostsArchive } from "@/widgets/post/posts-archive"

type LogArchiveItem = {
  id: string
  title: string
  slug: string
  subtitle: string | null
  publishedAt: Date | null
  createdAt: Date
  postTags: readonly {
    tag: {
      id: string
      name: string
      slug: string
    }
  }[]
}

type LogViewProps = {
  posts: readonly LogArchiveItem[]
}

export function LogView({ posts }: LogViewProps) {
  const archivePosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    subtitle: post.subtitle,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    createdAt: post.createdAt.toISOString(),
    tags: post.postTags
      .map(({ tag }) => tag)
      .sort((firstTag, secondTag) =>
        firstTag.name.localeCompare(secondTag.name, "ko-KR"),
      ),
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

      <PostsArchive
        posts={archivePosts}
        hrefPrefix="/log"
        itemLabel="로그"
        ariaLabel="공개 로그 목록"
        emptyMessage="아직 공개된 로그가 없습니다. 발견한 현상과 해결 기록이 생기면 이곳에 쌓입니다."
        selectedEmptyMessage="선택한 태그에 포함된 공개 로그가 없습니다."
      />
    </div>
  )
}
