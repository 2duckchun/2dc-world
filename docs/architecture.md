# Frontend Architecture

## 목적

이 문서는 이 저장소의 프론트엔드 아키텍처 기준을 정의한다.

- 디렉터리별 책임을 명확히 구분한다.
- 컴포넌트 경계와 import 방향을 팀 공통 규칙으로 고정한다.
- 페이지 구현 시 어디에 무엇을 두어야 하는지 빠르게 판단할 수 있게 한다.
- 이번 문서는 문서화만을 목적으로 하며, 런타임 동작이나 public API를 변경하지 않는다.

## 기본 원칙

- `src/app`은 Next.js App Router의 진입 계층이며 가능한 Server Component로 유지한다.
- `src/views`는 페이지 단위로 관리되는 계층이며 기본적으로 Server Component를 우선한다.
- 클라이언트 상호작용이 필요한 경우에는 `src/views` 내부의 하위 섹션 또는 컴포넌트에서만 `use client`를 선언한다.
- `src/widgets`는 여러 페이지에서 재사용되는 공용 조합 계층이다.
- `src/shared`는 가장 낮은 추상화 계층이며 상위 계층을 import하지 않는다.
- 계층 간 의존은 엄격한 단방향 규칙을 따른다.

## 디렉터리 역할

| 경로 | 역할 | 여기에 두는 것 | 여기에 두지 않는 것 |
| --- | --- | --- | --- |
| `src/app` | Next.js 진입 계층 | `layout.tsx`, `page.tsx`, `metadata`, route segment 설정, 전역 스타일 연결 | 페이지 세부 UI 구현, 페이지 전용 비즈니스 로직, 재사용 조합 컴포넌트 |
| `src/views` | 페이지 단위 조직 계층 | 특정 페이지에서만 쓰이는 섹션, 페이지 전용 hook, 페이지 조합 컴포넌트 | 여러 페이지에서 재사용되는 범용 조합 컴포넌트, 전역 util |
| `src/widgets` | 공용 조합 계층 | 레이아웃, 헤더, 푸터, 카드 묶음, 여러 view에서 재사용되는 복합 UI | 특정 페이지에만 종속되는 섹션, 페이지 전용 로직 |
| `src/shared` | 최하위 공용 계층 | UI primitives, constants, util, low-level helper, 공용 스타일 도구 | `views`, `widgets`, `domain`, `app`를 import하는 구현 |
| `src/core` | 기술 기반 라이브러리 계층 | `drizzle`, `trpc`, `tanstack-query`, 환경 설정, 인프라 초기화 | 페이지 조합 UI, 특정 도메인 화면 로직 |
| `src/domain` | 도메인 연결 계층 | API 연결, 도메인 모델, 도메인별 데이터 접근 로직 | Next.js route 진입 코드, 페이지별 UI 구현 |

## 계층별 상세 규칙

### `src/app`

- Next.js의 기본 컨벤션을 수용하는 계층이다.
- `layout.tsx`, `page.tsx`, `metadata`, route segment 관련 설정은 이 계층에서 관리한다.
- 최대한 Server Component로 유지한다.
- 직접 UI를 상세 구현하기보다 `src/views`나 `src/widgets`를 import해서 조합하는 역할에 집중한다.

예시:

```tsx
// src/app/example/page.tsx
import { ExampleView } from "@/views/example-page"

export default function ExamplePage() {
  return <ExampleView />
}
```

### `src/views`

- 하나의 페이지를 하나의 view 단위로 관리한다.
- 한 view 내부에는 그 페이지에서만 사용하는 섹션, hook, 보조 컴포넌트를 함께 둔다.
- 최종적으로 `index.tsx`에서 `SomethingView` 형태의 컴포넌트를 export하고 `src/app`에서 이를 불러 사용한다.
- 기본은 Server Component로 유지한다.
- 상태, 이벤트, 브라우저 API 등 클라이언트 상호작용이 필요한 경우에는 view 내부의 하위 섹션 또는 컴포넌트에 한해 `use client`를 선언한다.

예시 구조:

```text
src/views/example-page/
  index.tsx
  sections/
    hero-section.tsx
    content-section.tsx
  hooks/
    use-example-filter.ts
```

예시 export:

```tsx
// src/views/example-page/index.tsx
export function ExampleView() {
  return (
    <>
      {/* sections 조합 */}
    </>
  )
}
```

### `src/widgets`

- 여러 view에서 재사용될 수 있는 공용 조합 컴포넌트를 둔다.
- 단순 primitive가 아니라, 일정 수준의 레이아웃/조합 책임을 가진 컴포넌트를 둔다.
- 페이지 전용 요구사항이 들어오면 우선 `views`에 두고, 두 개 이상의 view에서 반복될 때 `widgets`로 승격하는 것을 기본 원칙으로 한다.

예시:

- 공용 레이아웃 래퍼
- 공통 헤더/푸터
- 여러 화면에서 재사용되는 복합 카드 섹션

### `src/shared`

- 가장 낮은 추상화 계층이다.
- 공용 constants, 공용 UI, util, helper, 스타일 보조 함수 등 범용 요소를 둔다.
- 상위 계층을 절대 import하지 않는다.
- 특정 화면이나 특정 도메인을 전제로 하는 구현은 두지 않는다.

예시:

- `src/shared/ui`
- `src/shared/lib`
- 공용 constants

### `src/core`

- 기술 스택과 인프라 초기화에 가까운 코어 계층이다.
- 특정 화면이 아니라 기술 기반을 제공하는 역할을 맡는다.
- 예를 들어 `drizzle`, `trpc`, `tanstack-query`, 환경 설정, 클라이언트/서버 초기화 코드가 이 위치에 온다.

### `src/domain`

- API와 도메인 모델을 연결하는 계층이다.
- 도메인별 데이터 접근, 요청/응답 모델, 비즈니스 단위의 연결 로직을 둔다.
- `trpc`의 실제 도메인 절차와 도메인 전용 client hook은 이 계층에서 관리한다.

권장 구조 예시:

```text
src/domain/example/
  procedure/
    get-list-items/
      index.ts
      schema.ts
      fixture.ts
    post-create-item/
      index.ts
      schema.ts
      fixture.ts
    router.ts
  hook/
    use-list-items.ts
    use-create-item.ts
```

세부 규칙:

- `src/core/trpc`는 `init`, `context`, base procedure, 최상위 router 합성 같은 기술 기반만 둔다.
- 실제 도메인 procedure는 `src/domain/<domain>/procedure` 아래에 둔다.
- 개별 procedure 폴더는 `get-*`, `post-*` 같은 읽기/변경 의도를 이름에 드러낸다.
- `schema.ts`에는 Zod 기반 `input`과 `output` 스키마를 둔다.
- `fixture.ts`에는 해당 Zod 스키마를 만족하는 대표 입력/출력 값을 둔다.
- `hook/`에는 TanStack Query + tRPC 기반의 재사용 가능한 도메인 hook을 둔다.
- 페이지에만 종속되는 hook은 `src/views`에 두고, 여러 view에서 재사용되는 도메인 hook만 `src/domain`에 둔다.

## 의존 방향 규칙

계층 간 import는 아래 방향으로만 허용한다.

- `src/app` -> `src/views`, `src/widgets`, `src/domain`, `src/core`, `src/shared`
- `src/views` -> `src/widgets`, `src/domain`, `src/core`, `src/shared`
- `src/widgets` -> `src/domain`, `src/core`, `src/shared`
- `src/domain` -> `src/core`, `src/shared`
- `src/core` -> `src/shared`
- `src/shared` -> 상위 계층 import 금지

핵심 원칙:

- 아래 계층은 위 계층을 import하지 않는다.
- 순환 참조를 만들지 않는다.
- 재사용 범위가 좁을수록 상위 계층에, 범위가 넓을수록 하위 계층에 둔다.

## Do / Don't

### Do

- `src/app`에서는 route 진입, metadata, layout 조합만 담당한다.
- 페이지 전용 구현은 `src/views` 아래에 모은다.
- 두 개 이상의 view에서 반복되는 조합은 `src/widgets`로 올린다.
- 범용 util과 공용 UI는 `src/shared`에 둔다.
- 기술 스택 초기화와 인프라 설정은 `src/core`에 둔다.
- API 연결과 도메인 단위 데이터 로직은 `src/domain`에 둔다.
- 도메인별 tRPC procedure, Zod schema, fixture, 재사용 hook은 `src/domain/<domain>` 아래에 둔다.

### Don't

- `src/shared`에서 `src/views`, `src/widgets`, `src/domain`, `src/app`를 import하지 않는다.
- `src/widgets`에 특정 페이지 전용 비즈니스 로직을 넣지 않는다.
- `src/app`에 세부 UI 구현을 계속 누적하지 않는다.
- 한 view에서만 쓰이는 구현을 바로 `src/widgets`나 `src/shared`로 올리지 않는다.
- `src/domain`에 페이지 렌더링 책임을 두지 않는다.
- `src/core`에 도메인별 procedure와 schema를 넣지 않는다.
- `src/views`에 재사용 가능한 tRPC domain hook을 흩뿌리지 않는다.

## 운영 메모

- 새로운 페이지를 만들 때는 먼저 `src/views/<page-name>`를 기준으로 구조를 잡는다.
- `src/app`은 해당 view를 import해 route와 연결하는 얇은 진입 계층으로 유지한다.
- 공용화 여부가 애매할 때는 우선 더 좁은 범위인 `views`에 두고, 반복이 확인되면 `widgets` 또는 `shared`로 이동한다.
- `src/domain` 내부에서는 도메인 기준으로 procedure와 hook을 묶고, procedure별 Zod schema와 fixture를 함께 둔다.
