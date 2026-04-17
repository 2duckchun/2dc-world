# Phase 0 - Foundation

## 목표

이 phase의 목적은 블로그 기능을 구현할 수 있는 기술 기반을 먼저 안정화하는 것이다. 이 단계에서는 아직 블로그 콘텐츠를 소비하거나 작성하는 완전한 경험을 만들지 않는다.

핵심 목표는 다음 다섯 가지다.

- Neon, Drizzle, Auth.js, TanStack Query + tRPC 조합을 프로젝트에 무리 없이 도입한다.
- owner와 일반 로그인 사용자를 구분할 수 있는 인증 컨텍스트를 만든다.
- light/dark 모드를 전역에서 일관되게 적용할 수 있게 한다.
- 이후 블로그 화면이 올라갈 공용 앱 셸을 만든다.
- `docs/architecture.md`에 맞는 폴더 책임을 실제 코드 구조로 정착시킨다.

## 범위

이 phase에서 포함하는 항목은 다음과 같다.

- 환경변수 구조와 검증 체계 정리
- Neon 연결과 Drizzle migration 실행 기반 구성
- Auth.js GitHub OAuth 연결
- TanStack Query client와 provider 기반 구성
- 세션을 읽을 수 있는 tRPC context와 기본 procedure 계층 구성
- 전역 테마 토글 구조와 persistence 처리
- 공용 블로그 앱 셸과 상단 네비게이션 뼈대

이 phase에서 아직 포함하지 않는 항목은 다음과 같다.

- 블로그 포스트 목록과 상세 페이지
- Lexical 에디터
- 좋아요, 댓글, 대댓글
- BOOKLOG 시리즈 관리 UI

## 선행 결정

- owner는 단일 GitHub 계정 1개로 판단한다.
- GitHub provider 계정 식별자는 환경변수로 관리한다.
- 인증은 UI에서 한 번 더 제한하더라도 서버에서 최종 권한을 판별한다.
- theme는 `html`의 `dark` class를 기준으로 제어한다.

## 세부 작업

### 1. 코어 인프라 구조 정리

다음 책임을 `src/core` 아래에 고정한다.

- `src/core/env`: 환경변수 파싱과 실행 시 검증
- `src/core/db`: Neon 연결과 Drizzle 클라이언트
- `src/core/db/schema`: 인증과 블로그 도메인에 필요한 schema 파일들
- `src/core/auth`: Auth.js 설정, provider, session 유틸
- `src/core/query`: TanStack Query client factory와 provider 보조 구성
- `src/core/trpc`: init, context, base procedure, 최상위 router 합성

이 단계에서는 폴더와 초기 진입 구조를 안정화하는 것이 목표다. 블로그 도메인 로직은 여기 넣지 않는다.

도메인 절차는 `src/domain/*` 아래에서 관리한다. Phase 0에서는 최소한 다음 구조를 스캐폴딩한다.

```text
src/domain/blog/
  procedure/
    router.ts
  hook/

src/domain/viewer/
  procedure/
    get-session/
      index.ts
      schema.ts
      fixture.ts
    get-capabilities/
      index.ts
      schema.ts
      fixture.ts
    router.ts
  hook/
```

구조 규칙은 다음처럼 고정한다.

- 개별 procedure는 `get-*` 또는 `post-*` 폴더 단위로 분리한다.
- `schema.ts`에는 해당 procedure의 Zod 기반 `input`, `output` 스키마를 둔다.
- `fixture.ts`에는 Zod 스키마를 만족하는 대표 입력/출력 값을 둔다.
- `router.ts`는 같은 도메인의 개별 procedure를 합쳐 도메인 router를 만든다.
- `hook/`에는 TanStack Query + tRPC 기반 재사용 hook을 둔다.

### 2. 환경변수와 실행 조건 확정

최소 환경변수는 다음 기준으로 정리한다.

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `OWNER_GITHUB_ID`

문서와 코드에서 모두 다음 규칙을 따른다.

- 서버 부팅 시 누락된 환경변수는 즉시 실패하게 한다.
- `OWNER_GITHUB_ID`는 사용자명 문자열이 아니라 provider 계정 식별자 기준으로 다룬다.
- 클라이언트에 노출할 필요가 없는 값은 모두 서버 전용으로 유지한다.

### 3. 데이터베이스와 migration 기반 구성

이 phase에서는 다음 수준까지 준비한다.

- Drizzle 설정 파일
- migration 생성/실행 스크립트
- Auth.js adapter에 필요한 기본 테이블
- 이후 블로그 테이블을 추가할 수 있는 schema 폴더 구조

블로그 본문, 댓글, 좋아요 테이블은 이 phase의 필수 완성 범위가 아니다. 다만 migration 파이프라인은 다음 phase에서 바로 테이블을 추가할 수 있는 상태여야 한다.

### 4. 인증과 권한 컨텍스트

Auth.js는 GitHub OAuth만 사용한다. 이 phase의 구현 목표는 다음과 같다.

- 로그인, 로그아웃, 현재 세션 조회가 가능하다.
- 서버에서 현재 사용자가 anonymous, authenticated, owner 중 무엇인지 계산할 수 있다.
- 이 정보가 tRPC context를 통해 모든 procedure에서 읽힌다.

권한 절차는 최소 세 가지로 나눈다.

- `publicProcedure`: 비로그인 포함 누구나 호출 가능
- `protectedProcedure`: 로그인 사용자만 호출 가능
- `ownerProcedure`: owner만 호출 가능

owner 판별은 다음 규칙으로 고정한다.

- 세션이 없으면 owner가 아니다.
- 세션이 있어도 GitHub provider account id가 `OWNER_GITHUB_ID`와 다르면 owner가 아니다.
- owner 여부는 DB role이 아니라 runtime policy로 계산한다.

### 5. TanStack Query + tRPC 기반 뼈대 구성

이 phase에서는 TanStack Query와 tRPC가 함께 동작하는 기본 구조까지 준비한다.

- App Router용 `app/api/trpc/[trpc]/route.ts`
- QueryClient factory
- 전역 Query provider
- `createTRPCContext`
- 최상위 app router 합성 파일
- server component에서 읽기용 caller를 사용할 수 있는 구조
- client component에서 query/mutation을 사용할 수 있는 provider 자리

이 단계에서 필요한 라우터는 최소한으로 유지한다.

- `viewerRouter.getSession`
- `viewerRouter.getCapabilities`

실제 블로그 기능 라우터는 Phase 1부터 추가한다.

클라이언트 데이터 계층 원칙은 다음처럼 고정한다.

- server component는 가능한 한 server caller로 읽기 데이터를 가져온다.
- client component의 상호작용은 TanStack Query + tRPC 조합을 사용한다.
- QueryClient는 전역 provider에서 공유하되, 블로그 기능 전용으로 쪼개지 않는다.
- 도메인별 hook은 `src/domain/*/hook`에서 `useQuery`, `useMutation` 래퍼 형태로 노출한다.
- procedure별 input/output 검증은 각 `schema.ts`의 Zod 스키마를 단일 기준으로 사용한다.

### 6. 전역 앱 셸과 테마

루트 layout은 이후 블로그 기능이 자연스럽게 붙을 수 있게 다음 구조를 가진다.

- 상단 헤더
- BLOG, MEMO, BOOKLOG로 이동하는 1차 네비게이션
- theme toggle
- 로그인 상태 영역

이 phase에서 셸은 완성형 디자인보다 구조 확정이 우선이다.

- 모바일에서는 한 줄 또는 두 줄 내에서 접히는 구조를 우선 고려한다.
- 데스크탑에서는 좌우 정렬과 넓은 콘텐츠 폭을 자연스럽게 지원한다.
- 테마 전환은 새로고침 후에도 유지되어야 한다.

## 파일 책임 초안

다음 배치를 Phase 0 기준안으로 고정한다.

- `src/app/layout.tsx`: 전역 provider 연결과 기본 셸 배치
- `src/app/api/auth/[...nextauth]/route.ts`: Auth.js handler 연결
- `src/app/api/trpc/[trpc]/route.ts`: tRPC HTTP 진입점
- `src/core/*`: 기술 기반
- `src/domain/viewer/*`: 세션과 capability 관련 procedure, schema, fixture, hook
- `src/domain/blog/*`: 블로그 도메인 router의 초기 스캐폴딩
- `src/widgets/*`: 전역 헤더와 블로그 공용 셸 조합 UI
- `src/views/*`: 아직 최소화하거나 빈 상태 유지

## 검증 항목

- DB 연결이 가능한지 확인한다.
- migration 생성과 적용이 가능한지 확인한다.
- GitHub 로그인과 로그아웃이 동작하는지 확인한다.
- 로그인하지 않은 상태, 일반 사용자 상태, owner 상태가 각각 구분되는지 확인한다.
- TanStack Query provider와 tRPC client 구성이 루트에서 정상 동작하는지 확인한다.
- theme toggle이 라이트/다크를 정상 전환하고 새로고침 후 유지되는지 확인한다.
- 공용 셸에서 `/blog`, `/memo`, `/booklog` 진입 링크가 노출되는지 확인한다.

## 완료 조건

- 인프라 스택이 프로젝트 안에서 실행 가능한 상태다.
- 인증 세션과 owner 판별이 서버 컨텍스트에서 재사용 가능하다.
- TanStack Query + tRPC 조합이 이후 client 상호작용 phase를 바로 받을 수 있는 상태다.
- 전역 theme 처리와 앱 셸이 이후 화면 개발을 막지 않는다.
- 다음 phase에서 포스트 읽기 기능을 바로 얹을 수 있다.

## 이번 phase에서 하지 않는 것

- 포스트 schema 확정
- 공개 포스트 읽기 화면
- 작성 페이지와 에디터
- 좋아요와 댓글 기능
- SEO와 sitemap
