# Phase 2 - Owner Authoring

## 목표

이 phase의 목적은 owner가 블로그를 실제로 운영할 수 있게 만드는 것이다. 이 단계가 끝나면 owner는 전용 작성 페이지에서 초안을 만들고, 수정하고, 발행할 수 있어야 한다.

핵심 목표는 다음과 같다.

- owner 전용 작성 진입점과 편집 화면을 만든다.
- Lexical 기반 에디터를 도입하되 저장 원본은 Markdown으로 유지한다.
- 초안 저장과 발행을 분리한다.
- BLOG, MEMO, BOOKLOG를 같은 작성 흐름 안에서 다룬다.
- 태그를 여러 개 입력하고 포스트와 연결할 수 있게 한다.
- BOOKLOG에 필요한 시리즈 메타를 입력할 수 있게 한다.

## 범위

포함 항목은 다음과 같다.

- `/write`, `/:type/new`, `/:type/[slug]/edit`
- owner 전용 보호 라우트와 서버 권한 검사
- Lexical 에디터와 Markdown round-trip
- draft save, update, publish workflow
- 기존 `posts`, `tags`, `post_tags`, `booklog_series`, `booklog_series_entries`에 대한 owner 쓰기 흐름
- BOOKLOG용 series 메타 입력

제외 항목은 다음과 같다.

- 이미지 업로드 스토리지/관리 인프라
- 파일 첨부
- 공동 작성자
- 발행 예약
- 비공개 상태 추가
- iframe 같은 richer embed의 일반화

## 작성 경험 원칙

- 상세 페이지 인라인 편집은 하지 않는다.
- 작성 경험은 전용 화면 한 곳에 모은다.
- 기본 레이아웃은 한 컬럼 중심으로 유지한다.
- 보조 메타 입력은 접거나 구획을 나눠 복잡도를 제어한다.
- Lexical은 편집 UI로만 사용하고, 영속 저장 기준은 Markdown으로 통일한다.

## 전제

이 phase는 Phase 1이 먼저 완료되어 아래 shared schema와 공개 읽기 라우트가 이미 존재한다고 가정한다.

- `posts`
- `tags`
- `post_tags`
- `booklog_series`
- `booklog_series_entries`
- `/blog`, `/memo`, `/booklog`, `/tags/[tag_name]`, `/:type/[slug]`, `/booklog/series/[series_slug]`

이 phase에서는 shared read model을 다시 설계하지 않고, owner 쓰기 흐름만 추가한다.

## 데이터 모델 결정

### posts

이 phase에서 작성/수정 대상인 기본 포스트 모델은 다음 필드 기준으로 고정한다.

- `id`
- `type`
- `status`
- `author_id`
- `title`
- `slug`
- `summary`
- `content_markdown`
- `published_at`
- `created_at`
- `updated_at`

규칙은 다음과 같다.

- 새 글 생성 시 상태는 기본 `DRAFT`다.
- 새 글 생성 시 slug는 제목으로 자동 제안한다.
- owner는 발행 전까지 slug를 수정할 수 있다.
- 한 번 발행된 후에는 제목 변경이 있어도 slug를 자동 변경하지 않는다.
- published post를 수정할 때도 같은 edit 화면을 사용한다.

### tags / post_tags

태그는 문자열 한 칼럼에 저장하지 않고 별도 테이블로 관리한다.

- `tags.id`
- `tags.name`
- `tags.created_at`
- `tags.updated_at`
- `post_tags.post_id`
- `post_tags.tag_id`
- `post_tags.created_at`

규칙은 다음과 같다.

- 한 포스트에는 여러 태그를 연결할 수 있다.
- 같은 태그는 여러 포스트에서 재사용할 수 있다.
- 저장 시 입력 문자열을 파싱해 태그를 정규화하고 `post_tags`를 동기화한다.
- 더 이상 연결되지 않은 태그를 정리할지는 구현 단계에서 정책으로 확정한다.

### booklog_series / booklog_series_entries

BOOKLOG는 일반 post 모델에 직접 시리즈 메타를 추가하지 않고, 별도 시리즈 모델과 연결 테이블로 처리한다.

- `booklog_series.id`
- `booklog_series.slug`
- `booklog_series.title`
- `booklog_series.description`
- `booklog_series.cover_image_url`
- `booklog_series.created_at`
- `booklog_series.updated_at`
- `booklog_series_entries.id`
- `booklog_series_entries.series_id`
- `booklog_series_entries.post_id`
- `booklog_series_entries.order_index`
- `booklog_series_entries.chapter_label`
- `booklog_series_entries.created_at`
- `booklog_series_entries.updated_at`

규칙은 다음과 같다.

- 기존 시리즈 선택과 새 시리즈 생성을 같은 작성 흐름 안에서 처리한다.
- 시리즈 내부 순서는 `order_index` 기준으로 입력한다.
- 챕터 라벨은 선택 입력이다.
- BOOKLOG 포스트만 시리즈 연결을 가진다.

## 에디터 데이터 흐름

저장 기준은 다음처럼 고정한다.

- DB source of truth는 `content_markdown`이다.
- Lexical은 `content_markdown`을 import 해서 편집 상태를 만든다.
- 저장 시 Lexical state를 Markdown으로 export 해 `content_markdown`에 기록한다.
- 읽기 화면은 기존 Phase 1 라우트에서 `content_markdown`을 서버에서 HTML로 렌더링한다.

즉 데이터 흐름은 다음과 같다.

- 조회: `content_markdown -> Lexical`
- 저장: `Lexical -> content_markdown`
- 공개 렌더: `content_markdown -> HTML`

## 에디터 범위

Lexical 에디터의 1차 지원 범위는 다음으로 제한한다.

- paragraph
- heading
- unordered list
- ordered list
- quote
- link
- code block
- image
- table

넣지 않는 기능은 다음과 같다.

- 파일 첨부
- iframe 같은 richer embed의 일반화
- slash menu 복잡 기능
- 협업 편집

에디터 구현 원칙은 다음과 같다.

- 텍스트 작성 안정성이 가장 중요하다.
- Lexical state는 영속 저장하지 않는다.
- Markdown round-trip 품질을 우선한다.
- 이미지와 표는 Markdown으로 표현 가능한 범위 안에서만 지원한다.
- 미리보기보다 저장/재진입 안정성을 우선한다.

## 라우트별 구현 계획

### `/write`

이 페이지는 owner 전용 진입점이다.

- 새 글 시작 버튼
- 카테고리별 작성 진입
- 최근 초안 목록
- 최근 수정 글 목록

을 포함한다.

### `/:type/new`

- 초기 빈 draft 생성 또는 새 작성 폼을 제공한다.
- 제목, 슬러그, 요약, 태그, 본문, 카테고리별 메타를 입력한다.
- BOOKLOG인 경우 시리즈 선택/생성, 순서, 챕터 라벨 입력을 함께 제공한다.
- 저장 시 draft가 생성된다.

### `/:type/[slug]/edit`

- 기존 포스트를 불러와 수정한다.
- DRAFT와 PUBLISHED 모두 같은 화면을 사용한다.
- 상태 표시와 마지막 수정 시각을 보여준다.
- 저장 시 현재 row를 갱신하고, 발행은 별도 액션으로 처리한다.

## 서버 절차 설계

owner 전용 procedure는 `src/domain/blog/procedure` 아래에서 최소 다음 범위로 나눈다.

- `get_draft_list/`
- `get_editable_post/`
- `post_create_draft/`
- `post_update_draft/`
- `post_publish/`
- `post_create_series/`
- `post_sync_tags/`

각 procedure 폴더는 다음 파일을 가진다.

- `index.ts`: ownerProcedure 또는 관련 procedure 구현
- `schema.ts`: Zod 기반 input/output 스키마
- `fixture.ts`: 입력/출력 대표 값

도메인 hook은 다음 수준으로 정리한다.

- `src/domain/blog/hook/use_create_draft.ts`
- `src/domain/blog/hook/use_update_draft.ts`
- `src/domain/blog/hook/use_publish.ts`
- `src/domain/blog/hook/use_create_series.ts`
- `src/domain/blog/hook/use_sync_tags.ts`

절차 규칙은 다음처럼 고정한다.

- owner가 아니면 모두 403 처리한다.
- 저장 시 입력값을 검증하고 `Lexical -> Markdown` export 결과를 `content_markdown`에 기록한다.
- 태그 저장은 `tags` upsert + `post_tags` 동기화로 처리한다.
- BOOKLOG 저장은 필요 시 `booklog_series_entries`를 upsert 한다.
- publish 시점에 `published_at`이 비어 있으면 현재 시각을 기록한다.
- `post_update_draft`는 상태를 자동으로 publish하지 않는다.

## UI/도메인 책임 배치

- `src/views/write_*`: 작성 대시보드와 작성 페이지 조합
- `src/widgets/editor_*`: 재사용 가능한 에디터 조합 UI
- `src/domain/blog/procedure/*`: 입력 검증, slug 정책, Markdown 변환, 작성 절차
- `src/domain/blog/hook/*`: 작성 화면에서 재사용하는 query/mutation hook

에디터 자체는 client component가 되지만, 페이지 라우트 진입과 데이터 조회는 가능한 한 server component에서 시작한다.

## 상세 구현 순서

### 1. Phase 1 shared schema 재사용 점검

Phase 1에서 만든 shared schema와 제약이 아래 기준을 만족하는지 먼저 점검한다.

- `unique(type, slug)`
- `unique(tags.name)`
- `unique(post_tags.post_id, post_tags.tag_id)`
- `unique(booklog_series.slug)`
- `unique(booklog_series_entries.series_id, booklog_series_entries.post_id)`
- `unique(booklog_series_entries.series_id, booklog_series_entries.order_index)`

필요한 경우에만 owner authoring에 필요한 추가 migration을 넣는다.

### 2. owner procedure 스캐폴딩

- draft 생성/수정/발행 procedure 추가
- 시리즈 생성 procedure 추가
- 태그 동기화 procedure 추가
- Markdown 저장 흐름을 procedure에서 공통 처리

### 3. owner 라우트와 서버 보호

- `/write`
- `/:type/new`
- `/:type/[slug]/edit`

를 추가하고, server component 진입에서 owner 여부를 검증한다.

### 4. Lexical + Markdown adapter

- Markdown import → Lexical 초기화
- Lexical export → Markdown 저장
- 재진입 시 편집 상태가 유지되는지 확인

### 5. 폼/액션 연결

- 제목, slug, summary, tags 입력
- 본문 저장
- publish 버튼 연결
- BOOKLOG 시리즈 메타 연결

### 6. Phase 1 읽기 라우트 호환 검증

- publish 후 기존 `/blog`, `/memo`, `/booklog` 읽기 라우트에서 바로 보이는지 확인
- BOOKLOG 상세와 시리즈 상세가 연결되는지 확인
- 태그 연결이 기존 `/tags/[tag_name]` 읽기 라우트에서 소비 가능한지 확인

## 검증 항목

- owner만 `/write`와 작성 페이지에 접근 가능한지 확인한다.
- BLOG, MEMO, BOOKLOG 초안 생성이 가능한지 확인한다.
- draft save 후 재진입 시 편집 상태가 유지되는지 확인한다.
- publish 후 공개 읽기 페이지에서 글이 노출되는지 확인한다.
- published post 수정 후 상세 페이지가 갱신되는지 확인한다.
- BOOKLOG 작성 시 시리즈, 순서, 챕터 라벨이 올바르게 저장되는지 확인한다.
- 태그 여러 개 입력이 저장되고 다시 편집 화면에 복원되는지 확인한다.
- 일반 로그인 사용자와 비로그인 사용자가 작성 라우트에 접근하지 못하는지 확인한다.

## 완료 조건

- owner가 세 타입의 포스트를 초안으로 작성하고 발행할 수 있다.
- Lexical 기반 텍스트 에디터가 Markdown 저장 기준으로 안정적으로 동작한다.
- 태그가 포스트에 연결되고 기존 읽기 라우트에서 재사용 가능한 상태다.
- 발행된 글은 기존 공개 읽기 라우트에서 바로 소비할 수 있다.
- BOOKLOG 시리즈 메타를 작성 흐름 안에서 함께 관리할 수 있다.

## 이번 phase에서 하지 않는 것

- 이미지 업로드 스토리지/관리 인프라
- 예약 발행
- 다중 작성자
- 댓글 관리 UI
- 관리자용 분석 화면
