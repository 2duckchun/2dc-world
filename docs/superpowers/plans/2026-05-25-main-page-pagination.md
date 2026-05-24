# Main Page Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 메인 페이지(`/`)의 `HomeContentExplorer`가 보여주는 posts·series 리스트를 10개 단위 truncated 페이지네이션으로 표시하고, 탭·태그·페이지 상태를 URL 검색 파라미터(`?tab=…&tag=…&page=…`)로 동기화한다.

**Architecture:** 서버 fetch와 tRPC procedure는 변경 없음. 기존 `HomeContentExplorer`(client component) 내부의 `useState` 두 개를 URL 검색 파라미터 동기화 훅(`useHomeExplorerParams`)으로 치환하고, 탭·태그로 좁힌 배열에 클라이언트에서 slicing을 적용한다. 리스트 하단에 shadcn `Pagination` 프리미티브를 감싼 `HomePagination` 래퍼를 렌더한다.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind v4, shadcn/ui (Pagination), lucide-react icons. 테스트 프레임워크 없음 — `pnpm typecheck` + `pnpm lint` + `pnpm build` + 브라우저 수동 검증으로 verify.

**Spec reference:** `docs/superpowers/specs/2026-05-25-main-page-pagination-design.md`

---

## File Structure

신규:
- `src/shared/ui/pagination.tsx` — shadcn CLI가 자동 생성 (PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis 등)
- `src/views/home/sections/home-content-explorer-section/hooks/use-home-explorer-params.ts` — URL 검색 파라미터 동기화 훅
- `src/views/home/sections/home-content-explorer-section/components/home-pagination.tsx` — truncated 페이지 번호 래퍼

수정:
- `src/views/home/sections/home-content-explorer-section/components/home-content-explorer.tsx` — `useState` 두 개를 훅으로 치환, slicing 추가, 페이지네이션 컨트롤 렌더, section ref로 스크롤 처리
- `src/views/home/sections/home-content-explorer-section/index.tsx` — `<HomeContentExplorer />` 호출부를 `<Suspense>`로 감싼다

변경 없음:
- `home-content-list.tsx`, `home-series-list.tsx`, `home-content-tabs.tsx`, `home-tag-filter.tsx`
- `get-home-content.ts`, `contentGetHomeContentProcedure`, 관련 Zod schema
- DB 스키마, 마이그레이션

---

## Conventions (이 프로젝트 한정)

- 세미콜론 없음 (biome `semicolons: "asNeeded"`).
- import는 절대경로 `@/...`.
- 파일은 `index.tsx`/`index.ts` 패턴이 기본이지만, 현재 explorer 섹션의 컴포넌트/훅은 파일명 자체(`home-pagination.tsx`)로 사용.
- 클라이언트 컴포넌트는 파일 상단에 `"use client"`.
- 아이콘은 lucide-react.
- 커밋 메시지 스타일: `feature: ...`, `chore: ...`, `docs: ...`.
- React 19 / Next.js 16: `useSearchParams`는 클라이언트 훅이며 호출부에 `<Suspense>` 경계 필요.

---

## Task 1: shadcn `Pagination` 컴포넌트 설치

**Files:**
- Create (자동): `src/shared/ui/pagination.tsx`

- [ ] **Step 1: shadcn CLI 실행**

루트에서 다음 명령 실행:

```bash
pnpm dlx shadcn@latest add pagination
```

`components.json`의 alias 설정에 따라 `src/shared/ui/pagination.tsx`가 생성된다. (`aliases.ui = "@/shared/ui"`)

- [ ] **Step 2: 생성 확인**

다음 export가 모두 존재하는지 확인:

```bash
grep -E "export.*(Pagination|PaginationContent|PaginationItem|PaginationLink|PaginationNext|PaginationPrevious|PaginationEllipsis)" src/shared/ui/pagination.tsx
```

기대 출력: 위 7개 이름이 export됨.

- [ ] **Step 3: 타입체크·린트**

```bash
pnpm typecheck
pnpm lint
```

기대: 두 명령 모두 통과.

- [ ] **Step 4: 커밋**

```bash
git add src/shared/ui/pagination.tsx components.json
git commit -m "chore: add shadcn pagination primitive"
```

(`components.json`은 보통 안 바뀌지만, shadcn이 registry/style 정보를 갱신할 수 있어 함께 stage.)

---

## Task 2: URL 검색 파라미터 동기화 훅 작성

**Files:**
- Create: `src/views/home/sections/home-content-explorer-section/hooks/use-home-explorer-params.ts`

- [ ] **Step 1: 훅 파일 작성**

다음 내용으로 새 파일 생성:

```ts
"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import type { HomeContentTab } from "@/views/home/sections/home-content-explorer-section/components/home-content-explorer"

const HOME_CONTENT_TABS = ["all", "post", "log", "series"] as const

const isHomeContentTab = (value: string | null): value is HomeContentTab =>
  value !== null &&
  (HOME_CONTENT_TABS as readonly string[]).includes(value)

const parseTab = (value: string | null): HomeContentTab =>
  isHomeContentTab(value) ? value : "all"

const parsePage = (value: string | null): number => {
  if (value === null) {
    return 1
  }
  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed) || parsed < 1) {
    return 1
  }
  return parsed
}

type ParamUpdates = {
  tab?: HomeContentTab
  tagSlug?: string | null
  page?: number
}

export type HomeExplorerParams = {
  tab: HomeContentTab
  tagSlug: string | null
  page: number
  setTab: (tab: HomeContentTab) => void
  setTagSlug: (tagSlug: string | null) => void
  setPage: (page: number) => void
}

export function useHomeExplorerParams(): HomeExplorerParams {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tab = parseTab(searchParams.get("tab"))
  const tagSlug = searchParams.get("tag")
  const page = parsePage(searchParams.get("page"))

  const updateParams = useCallback(
    (updates: ParamUpdates) => {
      const nextParams = new URLSearchParams(searchParams.toString())

      if ("tab" in updates) {
        if (updates.tab === undefined || updates.tab === "all") {
          nextParams.delete("tab")
        } else {
          nextParams.set("tab", updates.tab)
        }
      }
      if ("tagSlug" in updates) {
        if (updates.tagSlug === undefined || updates.tagSlug === null) {
          nextParams.delete("tag")
        } else {
          nextParams.set("tag", updates.tagSlug)
        }
      }
      if ("page" in updates) {
        if (updates.page === undefined || updates.page <= 1) {
          nextParams.delete("page")
        } else {
          nextParams.set("page", String(updates.page))
        }
      }

      const queryString = nextParams.toString()
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname
      router.replace(nextUrl, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  const setTab = useCallback(
    (nextTab: HomeContentTab) => {
      updateParams({ tab: nextTab, tagSlug: null, page: 1 })
    },
    [updateParams],
  )

  const setTagSlug = useCallback(
    (nextTagSlug: string | null) => {
      updateParams({ tagSlug: nextTagSlug, page: 1 })
    },
    [updateParams],
  )

  const setPage = useCallback(
    (nextPage: number) => {
      updateParams({ page: nextPage })
    },
    [updateParams],
  )

  return {
    tab,
    tagSlug,
    page,
    setTab,
    setTagSlug,
    setPage,
  }
}
```

설계 노트:
- `setTab` 호출 시 `tag`와 `page`를 함께 리셋 (스펙: 상태 전이 표).
- `setTagSlug` 호출 시 `page`만 리셋.
- 기본값(`tab="all"`, `tagSlug=null`, `page=1`)은 URL에서 제거.
- `router.replace` + `scroll: false`로 뒤로가기 히스토리 부풀리지 않고 자동 스크롤 방지 (스크롤은 `HomePagination` 호출부에서 명시적으로 처리).
- 잘못된 값은 표시용으로만 정규화하고 URL 자동 재작성은 안 함 (스펙 결정).

- [ ] **Step 2: 타입체크**

```bash
pnpm typecheck
```

기대: 통과. (이 시점에서 `HomeContentTab` 타입은 `home-content-explorer.tsx`에서 export되고 있음.)

- [ ] **Step 3: 커밋**

```bash
git add src/views/home/sections/home-content-explorer-section/hooks/use-home-explorer-params.ts
git commit -m "feature: add useHomeExplorerParams hook for url-synced filters"
```

---

## Task 3: `HomePagination` 래퍼 컴포넌트 작성

**Files:**
- Create: `src/views/home/sections/home-content-explorer-section/components/home-pagination.tsx`

- [ ] **Step 1: 컴포넌트 파일 작성**

다음 내용으로 새 파일 생성:

```tsx
"use client"

import type { MouseEvent } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination"

type HomePaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

type PageWindowItem =
  | { type: "page"; page: number }
  | { type: "ellipsis"; key: string }

const buildPageWindow = (
  currentPage: number,
  totalPages: number,
): PageWindowItem[] => {
  const pageSet = new Set<number>()
  pageSet.add(1)
  pageSet.add(totalPages)
  for (let offset = -1; offset <= 1; offset += 1) {
    const candidate = currentPage + offset
    if (candidate >= 1 && candidate <= totalPages) {
      pageSet.add(candidate)
    }
  }

  const sortedPages = [...pageSet].sort(
    (firstPage, secondPage) => firstPage - secondPage,
  )
  const items: PageWindowItem[] = []
  let previousPage: number | null = null
  for (const pageNumber of sortedPages) {
    if (previousPage !== null && pageNumber - previousPage > 1) {
      items.push({
        type: "ellipsis",
        key: `ellipsis-${previousPage}-${pageNumber}`,
      })
    }
    items.push({ type: "page", page: pageNumber })
    previousPage = pageNumber
  }
  return items
}

export function HomePagination({
  currentPage,
  totalPages,
  onPageChange,
}: HomePaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pageWindow = buildPageWindow(currentPage, totalPages)
  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= totalPages

  const handleNavigate =
    (target: number) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      if (target < 1 || target > totalPages || target === currentPage) {
        return
      }
      onPageChange(target)
    }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={isFirstPage}
            tabIndex={isFirstPage ? -1 : undefined}
            className={
              isFirstPage ? "pointer-events-none opacity-50" : undefined
            }
            onClick={handleNavigate(currentPage - 1)}
          />
        </PaginationItem>
        {pageWindow.map((item) =>
          item.type === "ellipsis" ? (
            <PaginationItem key={item.key}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item.page}>
              <PaginationLink
                href="#"
                isActive={item.page === currentPage}
                aria-current={item.page === currentPage ? "page" : undefined}
                onClick={handleNavigate(item.page)}
              >
                {item.page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={isLastPage}
            tabIndex={isLastPage ? -1 : undefined}
            className={
              isLastPage ? "pointer-events-none opacity-50" : undefined
            }
            onClick={handleNavigate(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
```

설계 노트:
- `totalPages <= 1`이면 컨트롤 자체를 렌더하지 않음 (스펙: edge case).
- 첫/마지막 페이지에서 prev/next는 `aria-disabled` + `pointer-events-none opacity-50` + `tabIndex=-1`로 클릭/키보드 진입 차단.
- shadcn의 `PaginationLink`는 anchor 기반이라 `href="#"` 더미값을 주고 `event.preventDefault()`로 기본 이동을 막은 뒤 콜백 호출.
- truncated 윈도우: 첫 페이지, 마지막 페이지, 현재 ±1를 보장하고 사이 끊김에는 ellipsis 삽입.

- [ ] **Step 2: 윈도우 로직 손으로 검증 (사고 실험)**

다음 입력에서 윈도우가 스펙과 일치하는지 점검:

| total | current | 기대 |
| --- | --- | --- |
| 3 | 2 | `1 [2] 3` |
| 7 | 1 | `[1] 2 3 … 7` |
| 7 | 4 | `1 … 3 [4] 5 … 7` |
| 12 | 6 | `1 … 5 [6] 7 … 12` |
| 12 | 12 | `1 … 10 11 [12]` |

`buildPageWindow`가 위 5케이스 모두 일치하는지 시각적으로 트레이스. 불일치 시 즉시 수정.

- [ ] **Step 3: 타입체크·린트**

```bash
pnpm typecheck
pnpm lint
```

기대: 통과.

- [ ] **Step 4: 커밋**

```bash
git add src/views/home/sections/home-content-explorer-section/components/home-pagination.tsx
git commit -m "feature: add HomePagination component with truncated page window"
```

---

## Task 4: `HomeContentExplorer`에 URL 동기화 + 페이지네이션 적용

**Files:**
- Modify: `src/views/home/sections/home-content-explorer-section/components/home-content-explorer.tsx`

- [ ] **Step 1: 파일 전체 교체**

`src/views/home/sections/home-content-explorer-section/components/home-content-explorer.tsx` 내용을 다음으로 교체:

```tsx
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
  const { tab: activeTab, tagSlug, page, setTab, setTagSlug, setPage } =
    useHomeExplorerParams()

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
```

변경 요약:
- `useState` 두 개를 `useHomeExplorerParams()` 단일 훅으로 치환.
- `effectiveTagSlug`로 URL의 태그 값이 현재 visible posts에 없으면 null로 정규화 (스펙: 잘못된 값 처리).
- `effectivePage`는 `page < 1 || page > totalPages`면 1로 강등 (스펙: 초과 시 마지막 페이지 clamp가 아니라 1페이지로).
- 페이지네이션 컨트롤은 결과가 1개라도 있으면 컨테이너에 감싸 렌더 (`HomePagination` 자체가 `totalPages <= 1`이면 null 반환하므로 빈 줄은 생기지 않음). `listLength > 0`만 가드해 empty 상태에서는 컨테이너도 렌더하지 않음.
- 페이지 변경 시 `sectionRef`로 explorer 섹션 상단 스크롤 (스펙).
- 탭 변경은 `setTab`이 내부적으로 tag/page 리셋하므로 별도 핸들러 불필요.

- [ ] **Step 2: 타입체크·린트**

```bash
pnpm typecheck
pnpm lint
```

기대: 통과. 만약 `useRef<HTMLElement>(null)` 관련 타입 에러가 나면 `useRef<HTMLElement | null>(null)`로 변경.

- [ ] **Step 3: 커밋**

```bash
git add src/views/home/sections/home-content-explorer-section/components/home-content-explorer.tsx
git commit -m "feature: paginate home content lists with url-synced filters"
```

---

## Task 5: `HomeContentExplorer` 호출부를 Suspense로 감싸기

**Files:**
- Modify: `src/views/home/sections/home-content-explorer-section/index.tsx`

- [ ] **Step 1: 파일 전체 교체**

`src/views/home/sections/home-content-explorer-section/index.tsx` 내용을 다음으로 교체:

```tsx
import { Suspense } from "react"
import { HomeContentExplorer } from "@/views/home/sections/home-content-explorer-section/components/home-content-explorer"
import { getHomeContents } from "./get-home-content"

export async function HomeContentExplorerSection() {
  const { posts, series } = await getHomeContents()
  return (
    <Suspense fallback={null}>
      <HomeContentExplorer posts={posts} series={series} />
    </Suspense>
  )
}
```

이유: `HomeContentExplorer`가 `useSearchParams`를 사용하므로 Next.js 16에서는 `<Suspense>` 경계 필요. fallback은 `null` — 데이터는 이미 서버에서 받아온 상태고 클라이언트 hydration 직전 순간만 다루므로 별도 스켈레톤 불필요.

- [ ] **Step 2: 타입체크·린트·빌드**

```bash
pnpm typecheck
pnpm lint
pnpm build
```

기대: 세 명령 모두 통과. 만약 `pnpm build`가 `useSearchParams` 관련 에러를 띄우면 Suspense fallback이 빠진 것이므로 Step 1 코드 재확인.

- [ ] **Step 3: 커밋**

```bash
git add src/views/home/sections/home-content-explorer-section/index.tsx
git commit -m "feature: wrap home content explorer with suspense for useSearchParams"
```

---

## Task 6: 브라우저 수동 검증

**Files:** (변경 없음)

- [ ] **Step 1: 개발 서버 기동**

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000/` 열기.

- [ ] **Step 2: 11가지 수동 시나리오 통과 확인**

순서대로 직접 클릭하며 확인:

1. **기본 진입**: `/` 접속 → All 탭, 첫 10개. URL은 그대로 `/`.
2. **페이지 이동**: 페이지 2 클릭 → URL이 `/?page=2`로 갱신, 다음 10개. explorer 섹션 상단으로 부드럽게 스크롤.
3. **뒤로가기**: 페이지 2 상태에서 글 카드 클릭 → 상세 진입 → 브라우저 뒤로가기 → `/?page=2`로 복귀, 같은 화면.
4. **탭 전환**: `tab=post&page=3` 상태에서 Log 탭 클릭 → URL이 `/?tab=log`로 갱신, page=1, 태그 선택 없음.
5. **태그 선택**: 페이지 2에서 태그 클릭 → URL에 `tag=…` 추가되고 `page` 파라미터 사라짐 (page=1로 리셋). 다시 "전체" 클릭하면 `tag` 파라미터 사라짐.
6. **Series 탭**: Series 탭 클릭 → 10개씩 페이지네이션 적용. 태그 필터 영역 비노출. 페이지 이동 정상 동작.
7. **이상 URL**: 직접 `http://localhost:3000/?tab=foo&page=999` 입력 → tab은 All, page는 1로 정규화된 정상 화면. URL은 그대로 (자동 정리 안 함).
8. **1페이지뿐**: 결과가 10개 이하인 탭/태그 조합에서 페이지네이션 컨트롤이 비노출.
9. **빈 결과**: 0건이 되는 태그 조합에서 empty 메시지만 보이고 컨트롤 비노출.
10. **새로고침**: `?tab=post&tag=react&page=3`(또는 데이터에 맞는 조합) 새로고침해도 같은 화면.
11. **키보드**: Tab으로 페이지 번호까지 포커스 이동, Enter로 페이지 변경, 활성 페이지가 `aria-current="page"`인지 DevTools로 확인.

각 시나리오를 통과할 때마다 위 체크리스트에 ✓ 표시. 실패 시 어느 코드를 손볼지 메모하고 수정.

- [ ] **Step 3: 시각 확인**

- 모바일 폭(DevTools 모바일 모드, 예: iPhone 12)에서 truncated 컨트롤이 한 줄에 들어오는지.
- 다크/라이트 테마 토글 시 페이지네이션 색상이 자연스러운지.

- [ ] **Step 4: 회귀 확인**

기존 동작 확인:
- 탭 카운트 표시 (탭 옆 배지) 변동 없음 — 항상 전체 카운트.
- 태그 카운트 표시 변동 없음 — 페이지 무관 전체 카운트.
- 글 상세 페이지/시리즈 상세 페이지 진입 정상.

- [ ] **Step 5: (선택) 수정 사항이 있으면 추가 커밋**

검증 중 발견한 수정은 작은 단위로 커밋:

```bash
git add <touched files>
git commit -m "fix: <한 줄 설명>"
```

---

## 완료 기준

- Task 1~5의 커밋이 `feature/main-page-pagination` 브랜치에 차례로 올라가 있음.
- `pnpm typecheck`, `pnpm lint`, `pnpm build` 모두 통과.
- Task 6의 11가지 수동 시나리오 모두 통과.
- 기존 탭/태그/렌더링/카운트 동작 회귀 없음.
- 데이터 페치 계층, tRPC procedure, DB 스키마 변경 없음 (`git diff main -- src/domain src/core/db src/core/trpc drizzle` 결과 비어있음).
