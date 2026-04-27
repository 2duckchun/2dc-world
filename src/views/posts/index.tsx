import { LibraryBig } from "lucide-react"
import { PostListHeader } from "@/widgets/post/post-list-header"
import { PostsArchive } from "./components/posts-archive"

type PostArchiveItem = {
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

type PostsViewProps = {
  posts: readonly PostArchiveItem[]
}

export function PostsView({ posts }: PostsViewProps) {
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
        icon={LibraryBig}
        eyebrow="published posts"
        title="Posts"
        description="긴 호흡의 글만 모아둔 공개 아카이브입니다. 최신 글부터 천천히 훑어보세요."
        meta={`공개된 글 ${posts.length.toLocaleString("ko-KR")}개`}
      />

      <PostsArchive posts={archivePosts} />
    </div>
  )
}
