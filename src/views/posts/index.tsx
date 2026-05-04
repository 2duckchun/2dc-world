"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { LibraryBig } from "lucide-react"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import type { PostArchiveData } from "@/domain/content/procedure/get-post-archive/schema"
import { PostListHeader } from "@/widgets/post/post-list-header"
import { PostsArchive } from "@/widgets/post/posts-archive"

const toIsoString = (value: Date | string) => new Date(value).toISOString()

const toArchivePosts = (posts: PostArchiveData) =>
  posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    subtitle: post.subtitle,
    publishedAt: post.publishedAt ? toIsoString(post.publishedAt) : null,
    createdAt: toIsoString(post.createdAt),
    tags: post.postTags
      .map(({ tag }) => tag)
      .sort((firstTag, secondTag) =>
        firstTag.name.localeCompare(secondTag.name, "ko-KR"),
      ),
  }))

export function PostsView() {
  const trpc = useTRPC()
  const { data: posts } = useSuspenseQuery(
    trpc.content.getPostArchive.queryOptions(),
  )
  const archivePosts = toArchivePosts(posts)

  return (
    <div className="grid w-full gap-6">
      <PostListHeader
        icon={LibraryBig}
        eyebrow="published posts"
        title="Posts"
        description="긴 호흡의 글만 모아둔 공개 아카이브입니다. 최신 글부터 천천히 훑어보세요."
        meta={`공개된 글 ${posts.length.toLocaleString("ko-KR")}개`}
      />

      <PostsArchive
        posts={archivePosts}
        hrefPrefix="/posts"
        itemLabel="글"
        ariaLabel="공개 글 목록"
        emptyMessage="아직 공개된 글이 없습니다. 첫 글이 올라오면 이곳에 차곡차곡 쌓입니다."
        selectedEmptyMessage="선택한 태그에 포함된 공개 글이 없습니다."
      />
    </div>
  )
}
