"use client"

import { useMemo, useState } from "react"
import type { PostKind } from "@/domain/content/types"
import { animationDelay } from "@/shared/lib/animation"
import { HomeContentList } from "@/views/home/sections/home-content-explorer-section/components/home-content-list"
import {
  type HomeContentTabItem,
  HomeContentTabs,
} from "@/views/home/sections/home-content-explorer-section/components/home-content-tabs"
import { HomeSeriesList } from "@/views/home/sections/home-content-explorer-section/components/home-series-list"
import { HomeTagFilter } from "@/views/home/sections/home-content-explorer-section/components/home-tag-filter"

export type HomeContentTab = "all" | PostKind

export type HomeContentTag = {
  id: string
  name: string
  slug: string
}

export type HomeContentPost = {
  id: string
  title: string
  href: string
  kind: PostKind
  subtitle: string | null
  publishedAt: string | null
  createdAt: string
  tags: readonly HomeContentTag[]
}

export type HomeContentSeries = {
  id: string
  title: string
  href: string
  description: string | null
  thumbnail: string | null
  episodeCount: number
  latestAt: string
}

export type HomeContentExplorerProps = {
  posts: readonly HomeContentPost[]
  series: readonly HomeContentSeries[]
}

type TagOption = HomeContentTag & {
  count: number
}

const tabLabels = {
  all: "All",
  post: "Post",
  log: "Log",
  series: "Series",
} satisfies Record<HomeContentTab, string>

const contentTabs = ["all", "post", "log", "series"] as const

const getTagOptions = (posts: readonly HomeContentPost[]) => {
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

const getTabItems = (
  posts: readonly HomeContentPost[],
  series: readonly HomeContentSeries[],
): readonly HomeContentTabItem[] =>
  contentTabs.map((tab) => ({
    value: tab,
    label: tabLabels[tab],
    count:
      tab === "all"
        ? posts.length
        : tab === "series"
          ? series.length
          : posts.filter((post) => post.kind === tab).length,
  }))

const getEmptyMessage = (
  activeTab: HomeContentTab,
  selectedTagSlug: string | null,
) => {
  if (selectedTagSlug) {
    return "선택한 태그에 포함된 공개 글이 없습니다."
  }

  if (activeTab === "post") {
    return "아직 공개된 글이 없습니다."
  }

  if (activeTab === "log") {
    return "아직 공개된 로그가 없습니다."
  }

  return "아직 공개된 콘텐츠가 없습니다."
}

export function HomeContentExplorer({
  posts,
  series,
}: HomeContentExplorerProps) {
  const [activeTab, setActiveTab] = useState<HomeContentTab>("all")
  const [selectedTagSlug, setSelectedTagSlug] = useState<string | null>(null)
  const tabItems = useMemo(() => getTabItems(posts, series), [posts, series])
  const visiblePosts = useMemo(
    () =>
      activeTab === "all" || activeTab === "series"
        ? posts
        : posts.filter((post) => post.kind === activeTab),
    [activeTab, posts],
  )
  const tagOptions = useMemo(() => getTagOptions(visiblePosts), [visiblePosts])
  const filteredPosts = useMemo(
    () =>
      selectedTagSlug
        ? visiblePosts.filter((post) =>
            post.tags.some((tag) => tag.slug === selectedTagSlug),
          )
        : visiblePosts,
    [selectedTagSlug, visiblePosts],
  )

  const handleTabChange = (tab: HomeContentTab) => {
    setActiveTab(tab)
    setSelectedTagSlug(null)
  }

  return (
    <section
      className="animate-rise overflow-hidden rounded-lg border border-border bg-card shadow-sm"
      style={animationDelay(130)}
      aria-labelledby="home-content-explorer-title"
    >
      <h2 id="home-content-explorer-title" className="sr-only">
        홈 콘텐츠 탐색
      </h2>

      <HomeContentTabs
        tabs={tabItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {activeTab !== "series" ? (
        <HomeTagFilter
          tags={tagOptions}
          selectedTagSlug={selectedTagSlug}
          totalCount={visiblePosts.length}
          filteredCount={filteredPosts.length}
          onTagChange={setSelectedTagSlug}
        />
      ) : null}

      <div
        id={`home-content-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`home-content-tab-${activeTab}`}
        className="border-border border-t bg-card"
      >
        {activeTab === "series" ? (
          <HomeSeriesList series={series} />
        ) : (
          <HomeContentList
            posts={filteredPosts}
            ariaLabel={`${tabLabels[activeTab]} 공개 콘텐츠 목록`}
            emptyMessage={getEmptyMessage(activeTab, selectedTagSlug)}
          />
        )}
      </div>
    </section>
  )
}
