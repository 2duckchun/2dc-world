"use client"

import { Hash, Layers2 } from "lucide-react"
import { useMemo, useState } from "react"
import { Button } from "@/shared/ui/button"
import { PostList, type PostListItem } from "@/widgets/post/post-list"

export type PostsArchiveTag = {
  id: string
  name: string
  slug: string
}

export type PostsArchiveItem = {
  id: string
  title: string
  slug: string
  subtitle: string | null
  publishedAt: string | null
  createdAt: string
  tags: readonly PostsArchiveTag[]
}

type TagOption = PostsArchiveTag & {
  count: number
}

type PostsArchiveProps = {
  posts: readonly PostsArchiveItem[]
  hrefPrefix: string
  itemLabel: string
  ariaLabel: string
  emptyMessage: string
  selectedEmptyMessage: string
}

const getTagOptions = (posts: readonly PostsArchiveItem[]) => {
  const tagOptionsBySlug = new Map<string, TagOption>()

  for (const post of posts) {
    for (const tag of post.tags) {
      const currentTag = tagOptionsBySlug.get(tag.slug)

      tagOptionsBySlug.set(tag.slug, {
        ...tag,
        count: (currentTag?.count ?? 0) + 1,
      })
    }
  }

  return [...tagOptionsBySlug.values()].sort((firstTag, secondTag) => {
    const countComparison = secondTag.count - firstTag.count

    return countComparison === 0
      ? firstTag.name.localeCompare(secondTag.name, "ko-KR")
      : countComparison
  })
}

const toPostListItem = (
  post: PostsArchiveItem,
  hrefPrefix: string,
): PostListItem => ({
  id: post.id,
  title: post.title,
  href: `${hrefPrefix}/${post.slug}`,
  subtitle: post.subtitle,
  publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
  createdAt: new Date(post.createdAt),
  tags: post.tags,
})

export function PostsArchive({
  posts,
  hrefPrefix,
  itemLabel,
  ariaLabel,
  emptyMessage,
  selectedEmptyMessage,
}: PostsArchiveProps) {
  const [selectedTagSlug, setSelectedTagSlug] = useState<string | null>(null)
  const tagOptions = useMemo(() => getTagOptions(posts), [posts])
  const selectedTag = selectedTagSlug
    ? (tagOptions.find((tag) => tag.slug === selectedTagSlug) ?? null)
    : null
  const filteredPosts = useMemo(
    () =>
      (selectedTagSlug
        ? posts.filter((post) =>
            post.tags.some((tag) => tag.slug === selectedTagSlug),
          )
        : posts
      ).map((post) => toPostListItem(post, hrefPrefix)),
    [hrefPrefix, posts, selectedTagSlug],
  )

  return (
    <div className="grid gap-4">
      {tagOptions.length > 0 ? (
        <section
          aria-label="태그 필터"
          className="grid gap-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-medium text-sm">
              <Hash className="size-4 text-chart-3" />
              <span>Tags</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {selectedTag
                ? `${selectedTag.name} ${itemLabel} ${filteredPosts.length.toLocaleString("ko-KR")}개`
                : `전체 ${itemLabel} ${posts.length.toLocaleString("ko-KR")}개`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={selectedTagSlug === null ? "secondary" : "outline"}
              size="sm"
              aria-pressed={selectedTagSlug === null}
              onClick={() => setSelectedTagSlug(null)}
            >
              <Layers2 data-icon="inline-start" className="size-3.5" />
              전체
            </Button>
            {tagOptions.map((tag) => (
              <Button
                key={tag.slug}
                type="button"
                variant={selectedTagSlug === tag.slug ? "secondary" : "outline"}
                size="sm"
                aria-pressed={selectedTagSlug === tag.slug}
                onClick={() => setSelectedTagSlug(tag.slug)}
              >
                <Hash data-icon="inline-start" className="size-3.5" />
                {tag.name}
                <span className="text-muted-foreground tabular-nums">
                  {tag.count}
                </span>
              </Button>
            ))}
          </div>
        </section>
      ) : null}

      <PostList
        posts={filteredPosts}
        ariaLabel={
          selectedTag ? `${selectedTag.name} 공개 ${itemLabel} 목록` : ariaLabel
        }
        emptyMessage={selectedTag ? selectedEmptyMessage : emptyMessage}
      />
    </div>
  )
}
