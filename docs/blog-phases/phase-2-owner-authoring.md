# Phase 2 - Owner Authoring

## 목표

이 phase의 목적은 owner가 블로그를 실제로 운영할 수 있게 만드는 것이다. 이 단계가 끝나면 owner는 전용 작성 페이지에서 초안을 만들고, 수정하고, 발행할 수 있어야 한다.

핵심 목표는 다음과 같다.

- owner 전용 작성 진입점과 편집 화면을 만든다.
- Lexical 기반 에디터를 도입한다.
- 초안 저장과 발행을 분리한다.
- BLOG, MEMO, BOOKLOG를 같은 작성 흐름 안에서 다룬다.
- BOOKLOG에만 필요한 시리즈 메타를 입력할 수 있게 한다.

## 범위

포함 항목은 다음과 같다.

- `/write`, `/:type/new`, `/:type/[slug]/edit`
- owner 전용 보호 라우트와 서버 권한 검사
- Lexical 에디터와 텍스트 중심 툴바
- draft save, update, publish workflow
- BOOKLOG용 series 메타 입력

제외 항목은 다음과 같다.

- 본문 이미지 업로드
- 첨부파일
- 공동 작성자
- 발행 예약
- 비공개 상태 추가

## 작성 경험 원칙

- 상세 페이지 인라인 편집은 하지 않는다.
- 작성 경험은 전용 화면 한 곳에 모은다.
- 기본 레이아웃은 한 컬럼 중심으로 유지한다.
- 보조 메타 입력은 접거나 구획을 나눠 복잡도를 제어한다.

## 데이터 모델 결정

이 phase에서 포스트 작성 모델은 다음 기준으로 고정한다.

- 원본 본문은 `lexicalState`에 저장한다.
- 공개 렌더용 본문은 `renderedHtml`에 저장한다.
- 목록용 요약은 `excerpt`에 저장한다.
- 상태는 `DRAFT | PUBLISHED`

추가 결정은 다음과 같다.

- 새 글 생성 시 slug는 제목으로 자동 제안한다.
- owner는 발행 전까지 slug를 수정할 수 있다.
- 한 번 발행된 후에는 제목 변경이 있어도 slug를 자동 변경하지 않는다.
- published post를 수정할 때도 같은 edit 화면을 사용한다.

## BOOKLOG 작성 규칙

BOOKLOG는 일반 post 모델 위에 다음 메타를 추가해 처리한다.

- `seriesId`
- `seriesOrder`
- `chapterLabel`

작성 UI는 다음 방식으로 고정한다.

- 기존 시리즈 선택
- 필요 시 새 시리즈를 같은 흐름 안에서 생성
- 시리즈 내부 순서를 숫자 기준으로 입력
- 챕터 라벨은 선택적 텍스트 입력

시리즈 생성은 별도 관리 화면보다 작성 흐름 안의 보조 입력으로 처리한다.

## 에디터 범위

Lexical 에디터의 1차 지원 범위는 다음으로 제한한다.

- paragraph
- heading
- unordered list
- ordered list
- quote
- link
- code block

넣지 않는 기능은 다음과 같다.

- 본문 이미지
- 파일 첨부
- 표
- slash menu 복잡 기능
- 협업 편집

에디터 구현 원칙은 다음과 같다.

- 텍스트 작성 안정성이 가장 중요하다.
- 저장 시 서버가 최종 렌더 산출물을 계산한다.
- 미리보기보다 편집 안정성과 상태 보존을 우선한다.

## 라우트별 구현 계획

### `/write`

이 페이지는 owner 전용 진입점이다.

- 새 글 시작 버튼
- 카테고리별 작성 진입
- 최근 초안 목록
- 최근 수정 글 목록

를 포함한다.

### `/:type/new`

- 초기 빈 draft 생성 또는 새 작성 폼을 제공한다.
- 제목, 슬러그, 상태, 본문, 카테고리별 메타를 입력한다.
- 저장 시 draft가 생성된다.

### `/:type/[slug]/edit`

- 기존 포스트를 불러와 수정한다.
- DRAFT와 PUBLISHED 모두 같은 화면을 사용한다.
- 상태 표시와 마지막 수정 시각을 보여준다.

## 서버 절차 설계

owner 전용 procedure는 `src/domain/blog/procedure` 아래에서 최소 다음 범위로 나눈다.

- `get-draft-list/`
- `get-editable-post/`
- `post-create-draft/`
- `post-update-draft/`
- `post-publish/`
- `post-create-series/`

각 procedure 폴더는 다음 파일을 가진다.

- `index.ts`: ownerProcedure 또는 관련 procedure 구현
- `schema.ts`: Zod 기반 input/output 스키마
- `fixture.ts`: 입력/출력 대표 값

도메인 hook은 다음 수준으로 정리한다.

- `src/domain/blog/hook/use-create-draft.ts`
- `src/domain/blog/hook/use-update-draft.ts`
- `src/domain/blog/hook/use-publish.ts`
- `src/domain/blog/hook/use-create-series.ts`

절차 규칙은 다음처럼 고정한다.

- owner가 아니면 모두 403 처리한다.
- 저장 시 입력값을 검증하고 `lexicalState -> renderedHtml/excerpt` 변환을 수행한다.
- publish 시점에 `publishedAt`이 비어 있으면 현재 시각을 기록한다.
- updateDraft는 상태를 자동으로 publish하지 않는다.

## UI/도메인 책임 배치

- `src/views/write-*`: 작성 대시보드와 작성 페이지 조합
- `src/widgets/editor-*`: 재사용 가능한 에디터 조합 UI
- `src/domain/blog/procedure/*`: 입력 검증, slug 정책, 렌더 변환, 작성 절차
- `src/domain/blog/hook/*`: 작성 화면에서 재사용하는 query/mutation hook

에디터 자체는 client component가 되지만, 페이지 라우트 진입과 데이터 조회는 가능한 한 server component에서 시작한다.

## 검증 항목

- owner만 `/write`와 작성 페이지에 접근 가능한지 확인한다.
- BLOG, MEMO, BOOKLOG 초안 생성이 가능한지 확인한다.
- draft save 후 재진입 시 편집 상태가 유지되는지 확인한다.
- publish 후 공개 읽기 페이지에서 글이 노출되는지 확인한다.
- published post 수정 후 상세 페이지가 갱신되는지 확인한다.
- BOOKLOG 작성 시 series와 순서 정보가 올바르게 저장되는지 확인한다.
- 일반 로그인 사용자와 비로그인 사용자가 작성 라우트에 접근하지 못하는지 확인한다.

## 완료 조건

- owner가 세 타입의 포스트를 초안으로 작성하고 발행할 수 있다.
- Lexical 기반 텍스트 에디터가 안정적으로 동작한다.
- 발행된 글은 기존 공개 읽기 라우트에서 바로 소비할 수 있다.
- BOOKLOG 시리즈 메타를 작성 흐름 안에서 함께 관리할 수 있다.

## 이번 phase에서 하지 않는 것

- 이미지 업로드
- 예약 발행
- 다중 작성자
- 댓글 관리 UI
- 관리자용 분석 화면
