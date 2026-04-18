# Phase 1 - Public Reading

## 목표

이 phase의 목적은 비로그인 사용자도 블로그를 읽을 수 있는 공개 소비 흐름을 완성하는 것이다. 이 단계에서 블로그는 최소한 읽을 수 있는 제품이어야 하며, 쓰기와 상호작용은 다음 phase로 넘긴다.

핵심 목표는 다음과 같다.

- BLOG, MEMO, BOOKLOG 목록 페이지를 제공한다.
- 각 타입의 상세 페이지를 제공한다.
- BOOKLOG 시리즈 목록과 시리즈 상세 읽기 경험을 제공한다.
- 태그별 포스트 목록을 제공한다.
- 포스트 상세는 SEO에 유리한 서버 렌더 기준으로 구성한다.

## 범위

포함 항목은 다음과 같다.

- `posts`, `tags`, `post_tags`, `booklog_series`, `booklog_series_entries` 중심 데이터 모델 도입
- 공개 목록과 상세 read procedure
- `/blog`, `/memo`, `/booklog`, `/tags/[tag_name]`, `/:type/[slug]`, `/booklog/series/[series_slug]` 라우트
- `generateMetadata`, `not_found` 수준의 읽기 기본 처리

제외 항목은 다음과 같다.

- owner 작성 화면
- Lexical 에디터
- 좋아요 mutation
- 댓글, 대댓글 UI와 mutation
- sitemap과 robots

## 데이터 모델 결정

### posts

이 phase에서 `posts`는 다음 역할을 수행해야 한다.

- 타입 구분: `BLOG | MEMO | BOOKLOG`
- 상태 구분: `DRAFT | PUBLISHED`
- 공개 읽기에서는 `PUBLISHED`만 노출
- 상세 조회는 `(type, slug)` 복합 키 기준

필수 필드는 다음 수준으로 고정한다.

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

공개 읽기 구현은 `content_markdown`을 읽고 서버에서 HTML로 렌더링하는 방식으로 처리한다.

### tags / post_tags

태그는 별도 테이블로 분리한다.

- `tags.id`
- `tags.name`
- `tags.created_at`
- `tags.updated_at`
- `post_tags.post_id`
- `post_tags.tag_id`
- `post_tags.created_at`

태그 읽기 규칙은 다음과 같다.

- 태그 페이지는 `tags.name`을 기준으로 포스트를 조회한다.
- 한 태그 안에서 BLOG, MEMO, BOOKLOG가 함께 나타날 수 있다.
- 목록에는 `PUBLISHED` 포스트만 포함한다.

### booklog_series / booklog_series_entries

BOOKLOG 시리즈는 별도 포스트가 아니라 BOOKLOG 포스트를 묶는 상위 모델로 둔다.

필수 필드는 다음 수준으로 고정한다.

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

시리즈 상세에서는 다음 정보를 함께 보여줘야 한다.

- 시리즈 소개
- 연결된 BOOKLOG 포스트 목록
- 포스트 간 순서 정보

## 라우트별 구현 계획

### `/blog`

- 최신 `BLOG` 포스트를 발행일 역순으로 나열한다.
- 카드형 요약 리스트를 기본 표현으로 사용한다.
- 카드에는 제목, 요약, 발행일, 읽기 진입 링크를 포함한다.

### `/memo`

- 최신 `MEMO` 포스트를 발행일 역순으로 나열한다.
- BLOG보다 더 정보 밀도가 높은 리스트형 UI를 사용한다.
- 메모성 기록의 특성상 요약과 날짜가 빠르게 보이도록 한다.

### `/booklog`

- 시리즈 목록과 최신 BOOKLOG 포스트를 함께 제공한다.
- 기본 우선순위는 시리즈 탐색이다.
- 시리즈가 없는 BOOKLOG도 읽을 수 있어야 하므로 최신 포스트 섹션을 별도로 둔다.

### `/tags/[tag_name]`

- 해당 태그가 연결된 공개 포스트 목록을 제공한다.
- 한 태그 안에서 BLOG, MEMO, BOOKLOG가 함께 나타날 수 있다.
- 목록 정렬은 최신 발행일 역순으로 유지한다.

### `/:type/[slug]`

- 제목, 메타, 본문, 이전/다음 탐색 정보를 제공한다.
- BOOKLOG인 경우 시리즈 안에서의 위치를 본문 상단 또는 하단에 표시한다.
- 상호작용 영역은 이 phase에서 실제 기능 없이 placeholder 수준으로만 둘 수 있다.

### `/booklog/series/[series_slug]`

- 시리즈 메타 정보
- 시리즈에 속한 BOOKLOG 포스트 목록
- 순서 기반 탐색

을 제공한다.

이 페이지의 핵심은 시리즈 흐름이 한눈에 보이는 것이다. 카드형보다 순서형 리스트가 우선이다.

## 읽기 데이터 흐름

- 목록과 상세 페이지는 server component 우선으로 구현한다.
- 읽기 데이터는 가능한 한 서버에서 조회하고 Markdown을 HTML로 렌더링한다.
- client component는 꼭 필요한 상호작용이 없는 한 만들지 않는다.

read procedure는 `src/domain/blog/procedure` 아래에서 다음 수준으로 구성한다.

- `get_list_published/`
- `get_by_slug/`
- `get_series_list/`
- `get_series_by_slug/`
- `get_by_tag/`

각 procedure 폴더는 다음 파일을 가진다.

- `index.ts`: procedure 구현
- `schema.ts`: Zod 기반 input/output 스키마
- `fixture.ts`: 스키마를 만족하는 대표 값

도메인 router와 hook 규칙은 다음처럼 고정한다.

- `src/domain/blog/procedure/router.ts`에서 위 procedure를 합쳐 `blog_router`를 만든다.
- 이 phase의 읽기 화면은 server caller 우선이므로, read hook은 반드시 만들 필요는 없다.
- 단, 여러 client widget에서 반복 사용할 조회가 생기면 `src/domain/blog/hook/use_*.ts`로 뺀다.

조회 규칙은 다음과 같다.

- `DRAFT`는 owner라도 공개 라우트에서 읽지 않는다.
- 잘못된 `(type, slug)` 조합은 `not_found`로 처리한다.
- BOOKLOG 상세에서는 `booklog_series_entries`를 통해 시리즈 탐색 정보도 함께 조회한다.
- 태그 목록은 `tags.name` 기준으로 조회하고 존재하지 않는 태그는 `not_found`로 처리한다.

## UI 구성 원칙

- 모바일에서 먼저 읽기 리듬이 좋아야 한다.
- BLOG는 여백과 타이포 가독성을 우선한다.
- MEMO는 정보 밀도와 훑기 쉬운 레이아웃을 우선한다.
- BOOKLOG는 순서 정보가 항상 보이도록 한다.

공용으로 재사용할 수 있는 조합 UI는 다음 범위로 제한한다.

- 포스트 카드
- 포스트 메타 라인
- 태그 리스트
- 시리즈 리스트 블록
- 상세 페이지 공통 헤더

타입별 차이가 큰 섹션은 `src/views`에 둔다.

도메인 책임은 다음처럼 유지한다.

- DB 조회와 출력 shaping은 `src/domain/blog/procedure/get_*`에서 처리한다.
- 페이지 조합과 섹션 배치는 `src/views`에서 처리한다.
- route 진입과 metadata 연결은 `src/app`에서 처리한다.

## 메타데이터와 에러 처리

이 phase에서 최소한 다음 처리는 들어가야 한다.

- 각 목록과 상세 페이지의 `metadata` 또는 `generate_metadata`
- 존재하지 않는 포스트, 태그, 시리즈에 대한 `not_found`
- 비어 있는 목록에 대한 empty state

이 phase에서는 OG 이미지 생성이나 sitemap까지는 하지 않는다.

## 구현 순서

### 1. shared schema + migration

다음 shared schema를 추가한다.

- `posts`
- `tags`
- `post_tags`
- `booklog_series`
- `booklog_series_entries`

이 단계에서 최소 제약도 함께 확정한다.

- `unique(type, slug)`
- `unique(tags.name)`
- `unique(post_tags.post_id, post_tags.tag_id)`
- `unique(booklog_series.slug)`
- `unique(booklog_series_entries.series_id, booklog_series_entries.post_id)`
- `unique(booklog_series_entries.series_id, booklog_series_entries.order_index)`

### 2. read procedure 구현

- `get_list_published`
- `get_by_slug`
- `get_series_list`
- `get_series_by_slug`
- `get_by_tag`

를 구현한다.

### 3. Markdown 읽기 렌더 경로 구현

- `content_markdown`을 서버에서 HTML로 렌더링한다.
- 이미지, 표, 코드 블록이 읽기 페이지에서 정상 표현되는지 확인한다.

### 4. 공개 읽기 라우트 구현

- `/blog`
- `/memo`
- `/booklog`
- `/tags/[tag_name]`
- `/:type/[slug]`
- `/booklog/series/[series_slug]`

를 server component 기준으로 연결한다.

### 5. 공용 읽기 UI 구성

- 포스트 카드
- 포스트 메타 라인
- 태그 리스트
- 시리즈 리스트 블록
- 상세 페이지 공통 헤더

를 구성한다.

### 6. metadata / not_found / empty state 정리

- 목록/상세/태그/시리즈 metadata
- 존재하지 않는 slug, tag, series 처리
- empty state 처리

## 검증 항목

- 비로그인 상태에서 세 카테고리 목록을 읽을 수 있는지 확인한다.
- 태그 페이지에서 해당 태그의 공개 포스트 목록을 읽을 수 있는지 확인한다.
- 각 카테고리 상세 페이지가 정상 렌더되는지 확인한다.
- BOOKLOG 시리즈 상세에서 순서가 의도대로 표시되는지 확인한다.
- DRAFT 포스트가 공개 라우트에 노출되지 않는지 확인한다.
- 잘못된 slug, tag_name, series_slug 접근이 `not_found`로 떨어지는지 확인한다.
- 모바일과 데스크탑에서 레이아웃이 무너지지 않는지 확인한다.

## 완료 조건

- 공개 사용자가 로그인 없이 BLOG, MEMO, BOOKLOG를 읽을 수 있다.
- 태그별 포스트 탐색이 동작한다.
- BOOKLOG 시리즈 탐색이 동작한다.
- 상세 페이지가 서버 렌더 기준으로 안정적으로 출력된다.
- 다음 phase에서 owner 작성 기능을 얹어도 공개 읽기 라우트 구조를 바꾸지 않아도 된다.

## 이번 phase에서 하지 않는 것

- 포스트 작성과 수정
- 초안 관리 UI
- 댓글/좋아요 인터랙션
- 검색
- SEO 운영 보강 전반
