# 관리자 뷰어 액션 (수정·삭제) 디자인

## 배경

관리자 계정으로 글 뷰어(`/posts/[slug]`, `/log/[slug]`, `/series/[series]/[slug]`) 및 시리즈 뷰어(`/series/[series]`)에 진입했을 때, 어드민 페이지(`/admin/posts`)로 이동하지 않고도 해당 글/시리즈를 바로 수정하거나 삭제할 수 있어야 한다. 현재는 어드민 목록 화면에서만 가능해 뷰어를 보고 있다가 "이 글을 고치자"가 되었을 때 이동 단계가 많다.

## 목표

- 관리자(role === "admin")에게만 뷰어 페이지에서 "수정" / "삭제" 버튼을 노출한다.
- 글 뷰어의 삭제는 기존 `post.archive` 동작을 재사용한다 (hard delete 아님).
- 시리즈 뷰어의 삭제는 기존 `series.delete` 동작을 재사용한다 (회차 cascade).
- 일반 사용자/비로그인 사용자에게는 어떠한 추가 UI 노이즈도 없다.

## 비목표 (YAGNI)

- 글 hard delete 절차 또는 archived 글 복구 UI 추가.
- 시리즈 전용 편집 페이지(`/admin/series/[id]/edit`) 신설. 기존 `/admin/series` 인라인 폼을 앵커 스크롤로 재활용한다.
- 커스텀 confirm dialog 컴포넌트. 기존 `window.confirm` 패턴(`series-edit-form/index.tsx`)을 그대로 따른다.
- "보관 취소"(unarchive) 기능. 어드민 목록의 기존 관리 흐름으로 충분.

## 컴포넌트 구조

신규 클라이언트 컴포넌트 두 개 + 기존 뷰어 컴포넌트의 prop 확장으로 구성한다. 기존 `PostDetailView`가 이미 `isAuthenticated: boolean` prop을 받는 패턴을 그대로 따른다.

| 신규 컴포넌트 | 위치 | 책임 |
| --- | --- | --- |
| `PostViewerAdminActions` | `src/widgets/post/post-viewer-admin-actions/` | 글 뷰어에서 수정·삭제 버튼 렌더. `trpc.post.archive` mutation. |
| `SeriesViewerAdminActions` | `src/widgets/series/series-viewer-admin-actions/` (폴더 신설) | 시리즈 뷰어에서 수정·삭제 버튼 렌더. `trpc.series.delete` mutation. |

| 수정되는 컴포넌트 | 변경 |
| --- | --- |
| `src/views/post-detail/index.tsx` | props에 `isAdmin: boolean`, `listHref: string` 추가. admin일 때 헤더 메타 라인 우측에 `PostViewerAdminActions` 렌더. |
| `src/views/series-detail/index.tsx` | props에 `isAdmin: boolean` 추가. admin일 때 헤더 메타 라인 우측에 `SeriesViewerAdminActions` 렌더. |
| `src/app/(default)/posts/[slug]/page.tsx` | `auth()`로 role 검증 후 `isAdmin`, `listHref="/posts"` 전달. |
| `src/app/(default)/log/[slug]/page.tsx` | `isAdmin`, `listHref="/log"` 전달. |
| `src/app/(default)/series/[series]/[slug]/page.tsx` | `isAdmin`, `listHref=AppRoutes.series.detail(seriesSlug)` 전달. |
| `src/app/(default)/series/[series]/page.tsx` | `isAdmin` 전달. |
| `src/views/admin-series/sections/existing-series-edit-form-section/...` | 각 시리즈 폼 래퍼에 `id="series-<id>"` 추가하여 hash 앵커 스크롤 가능하게. |
| `src/shared/utils/app-routes.ts` | `AppRoutes.admin.series.editAnchor(id)` 헬퍼 추가. |

## 데이터 흐름

```
Server Page (page.tsx)
  ├─ auth() → session.user.role
  ├─ isAdmin = session.user.role === "admin"
  └─ <PostDetailView post listHref isAdmin ...>
       └─ {isAdmin && <PostViewerAdminActions postId listHref />}
            ├─ Link to /admin/posts/[id]/edit
            └─ Button → confirm → trpc.post.archive.useMutation
                          ├─ onSuccess: toast + router.refresh + router.push(listHref)
                          └─ onError: toast
```

시리즈 뷰어도 동일한 패턴. `editAnchor`는 `/admin/series#series-<id>`로 이동하고 브라우저 기본 동작으로 해당 폼 위치까지 스크롤된다.

## 동작 규칙

### 가시성
- `isAdmin === false`이면 actions DOM 자체가 렌더되지 않는다.
- DOM이 우연히 노출되어도 mutation은 `adminProcedure`로 보호되어 서버에서 거절된다.

### 위치
- 헤더 메타 라인(날짜/시리즈 태그가 있는 줄) 우측 끝.
- 모바일에서 줄바꿈되어도 자연스럽게 wrap 되도록 기존 `flex flex-wrap gap-3` 컨테이너 안에 배치.

### 스타일
- 기존 admin-posts-list `admin-post-list-card.tsx`와 동일한 시그니처:
  - 수정: `variant="outline"`, `size="sm"`, `FilePenLine` 아이콘
  - 삭제: `variant="destructive"`, `size="sm"`, `Archive` 아이콘 (글) / `Trash2` 아이콘 (시리즈)

### 확인
- 글 삭제: `"이 글을 보관함으로 옮길까요?"` (정확한 카피는 구현 시 결정)
- 시리즈 삭제: 회차가 있을 때 `"이 시리즈와 연결된 N개 글을 모두 삭제할까요? 이 작업은 되돌릴 수 없습니다."`, 없을 때 `"이 시리즈를 삭제할까요?"` (기존 series-edit-form 메시지 재사용)

### Toast
- 기존 `sonner` 사용. 성공 메시지 예: `"글을 보관함으로 옮겼습니다."`, `"시리즈를 삭제했습니다."`
- 실패 시 `error.message` 우선, fallback 메시지 제공.

### 성공 후 처리
- `router.refresh()` 호출 후 `router.push(listHref)`.
- 시리즈 삭제는 `router.push("/series")`.

### 편집 진입
- 글: `Link href={AppRoutes.admin.posts.edit(postId)}`
- 시리즈: `Link href={AppRoutes.admin.series.editAnchor(seriesId)}`

## 엣지 케이스

- **비로그인/일반 사용자**: actions 컴포넌트 자체가 렌더되지 않음.
- **archive 도중 페이지 이탈**: 서버 상태는 정상 반영됨. 다음 진입 시 404 (정상 동작).
- **시리즈 cascade 삭제**: 확인 메시지에 회차 수 명시. `series.delete`가 batch로 posts/series 함께 삭제.
- **archived 글에 다시 진입 시도**: 공개 뷰어는 `getPostDetail`/`getLogDetail`/`getSeriesPostDetail`이 published 상태만 반환하므로 404. 사용자 흐름상 발생하지 않지만 안전.
- **목록 페이지 캐시**: `router.refresh()` → `router.push` 순서로 stale 캐시 방지.

## 검증 시나리오 (수동)

1. 로그아웃 상태에서 `/posts/<slug>` 진입 → actions 버튼 없음.
2. 일반 사용자로 로그인 후 진입 → actions 버튼 없음.
3. admin 계정으로 진입 → 헤더 메타 라인 우측에 "수정" / "삭제" 버튼.
4. "수정" 클릭 → `/admin/posts/<id>/edit`로 이동.
5. "삭제" 클릭 → confirm → 토스트 → `/posts`로 redirect → 목록에서 해당 글 사라짐.
6. `/log/<slug>` → 삭제 후 `/log`로 redirect.
7. `/series/<s>/<slug>` → 삭제 후 `/series/<s>`로 redirect (시리즈 detail).
8. `/series/<s>` 진입 후 "수정" 클릭 → `/admin/series#series-<id>` 앵커 스크롤 작동.
9. 시리즈 "삭제" 클릭 → cascade 메시지 → `/series`로 redirect.
10. 모바일 폭에서 헤더 메타 라인이 자연스럽게 wrap 되는지 확인.

## 영향 범위

- 신규 파일 2개 (actions 컴포넌트), 신규 폴더 1개 (`widgets/series`).
- 수정 파일 7개 (view 2, page 4, app-routes 1) + 시리즈 편집 폼 id 추가 1.
- 신규 백엔드 procedure 없음 (기존 `post.archive`, `series.delete` 재사용).
- DB 스키마 변경 없음.
