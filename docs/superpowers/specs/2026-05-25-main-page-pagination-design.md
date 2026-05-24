# 메인 페이지 리스트 페이지네이션 디자인

## 배경

메인 페이지(`/`)의 `HomeContentExplorer`는 현재 모든 공개 글과 시리즈를 한 번에 받아와 탭(`All` / `Post` / `Log` / `Series`)과 태그 필터로 좁힌 뒤, 결과를 **무제한 길이로** 그대로 렌더링한다. 콘텐츠가 누적되면 메인 페이지가 끝없이 길어지고, 특정 위치의 글을 다시 찾거나 공유하기도 어렵다. 10개 단위 페이지네이션을 적용해 한 화면에 보이는 양을 일정하게 유지한다.

## 목표

- 메인 페이지의 Posts 리스트(`HomeContentList`)와 Series 리스트(`HomeSeriesList`)에 **10개 단위 페이지네이션** 적용.
- 페이지 번호 스타일(truncated, `< 1 … 4 [5] 6 … 12 >`).
- 현재 **탭·태그·페이지 상태를 URL 검색 파라미터**(`?tab=…&tag=…&page=…`)로 옮겨 공유·새로고침·뒤로가기에 견고하게 만든다.
- 데이터 페치 계층은 그대로 두고, 클라이언트에서 슬라이싱한다.

## 비목표 (YAGNI)

- 서버 사이드 페이지네이션 / tRPC procedure 입력 확장. 데이터 규모상 불필요.
- 페이지 사이즈 변경 UI. 10개 고정.
- 무한 스크롤 / "더 보기" 버튼.
- Posts·Series 외 다른 페이지(`/posts`, `/series` 등)의 페이지네이션. 별도 작업으로 분리.
- 페이지네이션 키보드 단축키(예: `j`/`k`로 페이지 이동).

## 아키텍처

서버 fetch 구조는 변경하지 않는다.

```
Server: trpc.content.getHomeContent() → posts[], series[]   (변경 없음)
   ↓
HomeContentExplorer (Client)
  URL params: tab, tag, page
   ↓
filteredPosts / filteredSeries   (탭·태그 적용)
   ↓
pagedItems = filtered.slice((page-1)*10, page*10)
   ↓
HomeContentList / HomeSeriesList  +  HomePagination
```

변경되는 코드는 모두 `src/views/home/sections/home-content-explorer-section/` 내부와 `src/shared/ui/pagination.tsx`(shadcn 신규 설치)로 한정한다.

## 컴포넌트 구조

| 신규 | 위치 | 책임 |
| --- | --- | --- |
| `Pagination` (shadcn) | `src/shared/ui/pagination.tsx` | shadcn/ui 표준 페이지네이션 프리미티브. `pnpm dlx shadcn@latest add pagination`으로 추가. |
| `HomePagination` | `home-content-explorer-section/components/home-pagination.tsx` | shadcn primitive를 감싼 래퍼. truncated 윈도우 계산, `< 1 … 5 [6] 7 … 12 >` 형태 렌더. `totalPages <= 1`이면 `null`. |
| `useHomeExplorerParams` | `home-content-explorer-section/hooks/use-home-explorer-params.ts` | URL 검색 파라미터 동기화 훅. 읽기/쓰기 + 정규화 한 곳에 캡슐화. |

| 수정 | 변경 |
| --- | --- |
| `home-content-explorer.tsx` | `useState` 두 개(`activeTab`, `selectedTagSlug`)를 `useHomeExplorerParams()`로 치환. `filteredPosts`/`series` 뒤에 slicing 추가. 리스트 하단에 `HomePagination` 렌더. |
| `home-content-explorer-section/index.tsx` | `<HomeContentExplorer />` 호출부를 `<Suspense>`로 감싼다 (Next.js `useSearchParams` 요구사항). |

| 변경 없음 |
| --- |
| `home-content-list.tsx`, `home-series-list.tsx`, `home-content-tabs.tsx`, `home-tag-filter.tsx` |
| `get-home-content.ts`, `contentGetHomeContentProcedure`, 관련 Zod schema |
| DB 스키마, 마이그레이션 |

### `useHomeExplorerParams` 인터페이스

```ts
type HomeExplorerParams = {
  tab: HomeContentTab           // "all" | "post" | "log" | "series"
  tagSlug: string | null
  page: number                  // 항상 1 이상
  setTab: (tab: HomeContentTab) => void
  setTagSlug: (slug: string | null) => void
  setPage: (page: number) => void
}
```

내부 동작:
- `useSearchParams`로 읽고, 잘못된 값은 안전한 기본값(`tab="all"`, `tagSlug=null`, `page=1`)으로 정규화해 반환.
- 쓰기는 `router.replace(pathname + "?" + nextParams.toString(), { scroll: false })`로. 페이지 이동이 뒤로가기 히스토리에 쌓이지 않도록 `replace` 사용.
- 기본값과 같은 키는 URL에서 제거(예: `tab=all`, `page=1`은 생략).
- `setTab`은 내부적으로 `tag=null`, `page=1`도 함께 리셋 (탭 변경 → 결과 셋 자체가 달라지므로).
- `setTagSlug`는 `page=1`을 함께 리셋.
- 페이지 변경 시 스크롤은 `HomePagination` 쪽에서 explorer 섹션 ref로 `scrollIntoView`. 훅에서는 스크롤을 만지지 않는다 (`router.replace`의 `scroll: false`).

## URL 파라미터 동작

### 파라미터 형식

- `tab`: `"all"` | `"post"` | `"log"` | `"series"` — 기본 `"all"` (URL에서 생략)
- `tag`: 태그 slug 문자열 — 기본 없음 (선택 안 했으면 생략)
- `page`: 1 이상의 정수 — 기본 `1` (URL에서 생략)

기본값과 같은 키는 URL에서 제거해 깔끔하게 유지한다. 예:

- 첫 진입: `/`
- "post 탭 2페이지": `/?tab=post&page=2`
- "react 태그, 3페이지": `/?tag=react&page=3`

### 상태 전이 규칙

| 사용자 동작 | tab | tag | page |
| --- | --- | --- | --- |
| 탭 변경 | 새 탭 | **null로 리셋** | **1로 리셋** |
| 태그 선택/해제 | 유지 | 새 값 / null | **1로 리셋** |
| 페이지 번호 클릭 | 유지 | 유지 | 새 값 |

(탭 변경 시 태그 리셋은 기존 `handleTabChange` 동작 그대로다.)

### 잘못된/없는 값 처리

페이지 진입 시점에 표시용 변수로만 정규화하고, URL은 자동 재작성하지 않는다 (사용자가 다음 액션을 했을 때 자연스럽게 정리됨).

- `tab` 값이 enum 밖이면 → `"all"`
- `tag` 값이 현재 탭의 visible posts에 존재하지 않으면 → `null`
- `page` 값이 숫자가 아니거나 1 미만 / `totalPages` 초과 → `1`

### Series 탭의 tag 파라미터

Series 탭에서는 태그 필터 UI가 숨겨져 있다 (`activeTab !== "series"`일 때만 `HomeTagFilter` 렌더). URL에 `tag`가 있어도 Series 탭에서는 무시한다(시리즈 슬라이싱에는 영향 없음). 다른 탭으로 이동했을 때 URL의 `tag`가 그대로 살아 있을 수 있는데, 다음 탭 변경에서 `setTab`이 `tag=null`로 리셋하므로 결국 정리된다.

### 페이지 변경 시 스크롤

페이지 번호 클릭 시 explorer 섹션 상단으로 부드럽게 스크롤한다 (`scrollIntoView({ behavior: "smooth", block: "start" })`). 탭/태그 변경 시에는 스크롤하지 않는다 (현재 위치 유지).

포커스는 이동하지 않는다 — 키보드 사용자가 다른 페이지 번호로 연속 이동할 수 있도록 활성 페이지 버튼이 포커스를 유지.

## Edge Cases

- **전체 결과 0개**: 페이지네이션 컨트롤 숨김. 기존 `emptyMessage`만 표시.
- **결과 ≤ 10개**: 페이지네이션 컨트롤 숨김. `HomePagination`이 `totalPages <= 1`일 때 `null` 반환.
- **`page` > `totalPages`**: 1페이지로 강등해 렌더. URL은 그대로 두고, 다음 사용자 액션에서 자연 정리.
- **태그 카운트**: `HomeTagFilter`의 카운트는 페이지 무관 — 항상 visible posts 전체 기준. "React (15)"는 어느 페이지에 있든 항상 15.
- **`totalCount` / `filteredCount`**: 페이지 슬라이싱 **전** 값을 전달. 페이지네이션은 표시 영역에만 영향.

### 페이지 번호 윈도우 (truncated 로직)

항상 보임: 첫 페이지, 마지막 페이지, 현재 페이지, 현재의 ±1. 그 사이 끊김이 있으면 `…`(PaginationEllipsis).

| 총 페이지 | 현재 | 렌더 |
| --- | --- | --- |
| 3 | 2 | `< 1 [2] 3 >` |
| 7 | 1 | `< [1] 2 3 … 7 >` |
| 7 | 4 | `< 1 … 3 [4] 5 … 7 >` |
| 12 | 6 | `< 1 … 5 [6] 7 … 12 >` |
| 12 | 12 | `< 1 … 10 11 [12] >` |

### 접근성

- `HomePagination` 루트는 shadcn 기본 `<nav aria-label="페이지네이션">`.
- 현재 페이지 버튼은 `aria-current="page"`.
- 첫/마지막 페이지에서 prev/next는 `aria-disabled="true"` + 클릭 무효화.
- 페이지 변경 후 리스트 상단 스크롤은 하되 포커스 이동은 하지 않는다.

## 에러 처리

별도 try/catch 없음.

- URL 파라미터 이상치는 위 규칙으로 정규화.
- 데이터 fetch 실패는 기존 RSC + tRPC 에러 경로에 위임 (현 동작과 동일).

## 테스트 전략

이 저장소에 자동화된 테스트는 없으므로 검증은 **수동 시나리오 + 정적 검사** 중심이다.

### 검증 명령

- `pnpm tsc --noEmit`
- `pnpm biome check`
- `pnpm next build` — Suspense 경계와 `useSearchParams`가 빌드 통과하는지

### 수동 시나리오

1. **기본 진입**: `/` → `tab=all`, page 1, 첫 10개. URL은 그대로 `/`.
2. **페이지 이동**: 페이지 2 클릭 → URL이 `/?page=2`, 다음 10개. 리스트 상단으로 스크롤.
3. **뒤로가기**: 페이지 2에서 글 상세 진입 → 뒤로 → 페이지 2 복귀 (페이지 이동은 history에 안 쌓이므로 직전 비-페이지 화면으로).
4. **탭 전환**: `tab=post&page=3` 상태에서 Log 탭 클릭 → `tab=log&page=1`, tag null.
5. **태그 선택**: 페이지 2에서 태그 클릭 → `page=1`로 리셋되며 URL에 `tag=` 추가.
6. **Series 탭**: 시리즈 리스트도 10개 단위. 태그 필터 비노출, `tag` 파라미터는 무시.
7. **이상 URL**: `/?tab=foo&page=999` → tab `all`, page `1`로 정규화돼 정상 화면.
8. **1페이지뿐**: 결과 ≤ 10개일 때 페이지네이션 컨트롤 비노출.
9. **빈 결과**: 0건일 때 empty 메시지만, 컨트롤 비노출.
10. **새로고침**: `?tab=post&tag=react&page=3`을 새로고침해도 같은 화면.
11. **키보드**: Tab으로 페이지 번호까지 이동, Enter로 이동, `aria-current`로 활성 페이지 확인.

### 시각 확인

- 모바일 폭에서 truncated 컨트롤이 한 줄에 들어오는지.
- 다크/라이트 테마 모두에서 색상이 자연스러운지 (shadcn 기본값 사용).

## 완료 기준

- 위 11개 수동 시나리오 통과.
- `pnpm tsc --noEmit`, `pnpm biome check`, `pnpm next build` 통과.
- 기존 탭/태그/렌더링 동작 회귀 없음.
- 데이터 페치 계층, tRPC procedure, DB 스키마 변경 없음.
