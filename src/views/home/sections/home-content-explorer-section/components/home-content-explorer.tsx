"use client"

import { useMemo, useRef } from "react"
import type { PostKind } from "@/domain/content/types"
import { animationDelay } from "@/shared/lib/animation"
import { HomeContentList } from "@/views/home/sections/home-content-explorer-section/components/home-content-list"
import {
  type HomeContentTabItem,
  HomeContentTabs,
} from "@/views/home/sections/home-content-explorer-section/components/home-content-tabs"
import { HomePagination } from "@/views/home/sections/home-content-explorer-section/components/home-pagination"
import { HomeSeriesList } from "@/views/home/sections/home-content-explorer-section/components/home-series-list"
import { HomeTagFilter } from "@/views/home/sections/home-content-explorer-section/components/home-tag-filter"
import { useHomeExplorerParams } from "@/views/home/sections/home-content-explorer-section/hooks/use-home-explorer-params"

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

const PAGE_SIZE = 10

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
  const sectionRef = useRef<HTMLElement>(null)
  const {
    tab: activeTab,
    tagSlug,
    page,
    setTab,
    setTagSlug,
    setPage,
  } = useHomeExplorerParams()

  const tabItems = useMemo(() => getTabItems(posts, series), [posts, series])
  const visiblePosts = useMemo(
    () =>
      activeTab === "all" || activeTab === "series"
        ? posts
        : posts.filter((post) => post.kind === activeTab),
    [activeTab, posts],
  )
  const tagOptions = useMemo(() => getTagOptions(visiblePosts), [visiblePosts])

  const effectiveTagSlug = useMemo(
    () =>
      tagSlug && tagOptions.some((option) => option.slug === tagSlug)
        ? tagSlug
        : null,
    [tagSlug, tagOptions],
  )

  const filteredPosts = useMemo(
    () =>
      effectiveTagSlug
        ? visiblePosts.filter((post) =>
            post.tags.some((tag) => tag.slug === effectiveTagSlug),
          )
        : visiblePosts,
    [effectiveTagSlug, visiblePosts],
  )

  const isSeriesTab = activeTab === "series"
  const listLength = isSeriesTab ? series.length : filteredPosts.length
  const totalPages = Math.max(1, Math.ceil(listLength / PAGE_SIZE))
  const effectivePage = page < 1 || page > totalPages ? 1 : page
  const pageStart = (effectivePage - 1) * PAGE_SIZE
  const pageEnd = pageStart + PAGE_SIZE

  const pagedPosts = useMemo(
    () => filteredPosts.slice(pageStart, pageEnd),
    [filteredPosts, pageStart, pageEnd],
  )
  const pagedSeries = useMemo(
    () => series.slice(pageStart, pageEnd),
    [series, pageStart, pageEnd],
  )

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section
      ref={sectionRef}
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
        onTabChange={setTab}
      />

      {!isSeriesTab ? (
        <HomeTagFilter
          tags={tagOptions}
          selectedTagSlug={effectiveTagSlug}
          totalCount={visiblePosts.length}
          filteredCount={filteredPosts.length}
          onTagChange={setTagSlug}
        />
      ) : null}

      <div
        id={`home-content-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`home-content-tab-${activeTab}`}
        className="border-border border-t bg-card"
      >
        {isSeriesTab ? (
          <HomeSeriesList series={pagedSeries} />
        ) : (
          <HomeContentList
            posts={pagedPosts}
            ariaLabel={`${tabLabels[activeTab]} 공개 콘텐츠 목록`}
            emptyMessage={getEmptyMessage(activeTab, effectiveTagSlug)}
          />
        )}

        {listLength > 0 ? (
          <div className="border-border border-t p-4 sm:p-5">
            <HomePagination
              currentPage={effectivePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
