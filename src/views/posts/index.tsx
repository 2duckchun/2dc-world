import { LibraryBig } from "lucide-react"
import { PostList } from "@/widgets/post/post-list"
import { PostListHeader } from "@/widgets/post/post-list-header"

type PostArchiveItem = {
  id: string
  title: string
  slug: string
  subtitle: string | null
  publishedAt: Date | null
  createdAt: Date
}

type PostsViewProps = {
  posts: readonly PostArchiveItem[]
}

export function PostsView({ posts }: PostsViewProps) {
  const listPosts = posts.map((post) => ({
    ...post,
    href: `/posts/${post.slug}`,
  }))

  return (
    <div className="grid w-full gap-6">
      <PostListHeader
        icon={LibraryBig}
        eyebrow="published posts"
        title="Posts"
        description="긴 호흡의 글만 모아둔 공개 아카이브입니다. 최신 글부터 천천히 훑어보세요."
        meta={`공개된 글 ${posts.length.toLocaleString("ko-KR")}개`}
      />

      <PostList
        posts={listPosts}
        ariaLabel="공개 글 목록"
        emptyMessage="아직 공개된 글이 없습니다. 첫 글이 올라오면 이곳에 차곡차곡 쌓입니다."
      />
    </div>
  )
}
