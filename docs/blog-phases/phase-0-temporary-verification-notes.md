# Phase 0 - Temporary Verification Notes

이 문서는 **2026-04-18 기준**으로 Phase 0 구현에서 실제 환경으로 어디까지 검증했는지 임시로 기록해두는 메모다.

현재는 Phase 0에서 계획했던 핵심 검증 항목이 모두 완료된 상태이며, 이 문서는 완료 이력을 짧게 남겨두는 용도로만 유지한다.

## 목적

- 실제 자격 증명과 실제 환경 기준으로 무엇을 검증했는지 남긴다.
- 다음 phase에 들어가기 전에 Phase 0의 남은 불확실성이 해소됐는지 확인한다.
- 이후 필요 없으면 이 문서는 제거하거나 더 정식 체크리스트 문서로 흡수할 수 있다.

## 완료한 검증 항목

### 1. 실제 Neon 데이터베이스 연결 및 migration 적용

검증 일시:

- 2026-04-18

확인 결과:

- `.env.local` 기준으로 `pnpm db:migrate` 실행 성공
- Drizzle이 실제 Neon 데이터베이스에 연결되고 migration을 적용할 수 있음을 확인
- Auth.js 기본 테이블 생성 파이프라인이 실제 환경에서 동작함을 확인

실행한 명령:

- `pnpm db:migrate`

비고:

- Drizzle CLI가 `.env.local`을 직접 읽을 수 있도록 `drizzle.config.ts`를 보완했다.

### 2. production build

검증 일시:

- 2026-04-18

확인 결과:

- `.env.local` 기준으로 `pnpm exec next build --webpack` 성공
- `.env.local` 기준으로 `pnpm build`(Turbopack)도 성공
- 따라서 production build 경로는 현재 기준으로 정상 동작함을 확인

실행한 명령:

- `pnpm exec next build --webpack`
- `pnpm build`

### 3. 실제 GitHub OAuth 로그인 / 로그아웃 및 owner 판별

검증 일시:

- 2026-04-18

확인 결과:

- 실제 GitHub 계정으로 로그인한 세션이 정상 조회됨
- `githubAccountId`가 기대한 provider account id로 확인됨
- owner 계정 로그인 시 `role: owner`, `isOwner: true`가 확인됨
- owner capability가 정상 반영되어 owner 판별 로직이 실제 환경에서 동작함을 확인

확인 기준:

- 홈 화면의 viewer session / capabilities 출력
- `githubAccountId === OWNER_GITHUB_ID`
- `role === "owner"`
- `isOwner === true`

## 추가 메모

### 로컬 서버 직접 기동 smoke test

다음 시도는 현재 Codex sandbox 제약 때문에 완료하지 못했다.

- `pnpm start`

관찰 내용:

- `0.0.0.0:3000` 바인딩 단계에서 권한 오류가 발생했다.
- 이는 현재 sandbox의 포트 listen 제한에 가까운 문제로 보이며, build 성공 여부와는 별개다.

즉, 서버 기동 실패는 현재 구현 결함으로 보기보다 실행 환경 제약으로 기록한다.

## 이미 확인한 항목

다음 항목은 현재 기준으로 확인했다.

- `pnpm lint`
- `pnpm typecheck`
- `pnpm spellcheck`
- `pnpm db:migrate`
- `pnpm exec next build --webpack`
- `pnpm build`
- App Router 기준 route 스캐폴딩 생성
- Theme toggle 구조와 persistence 코드 연결
- tRPC + TanStack Query provider 및 viewer procedure 연결
- 실제 GitHub 로그인 세션 확인
- 실제 owner 판별 확인

## 정리 메모

Phase 0에서 추적하던 핵심 검증 항목은 현재 모두 완료했다.

따라서 이 문서는 다음 중 하나 시점에 정리하면 된다.

- Phase 1 작업에 들어가면서 제거할 때
- 더 정식 운영/개발 체크리스트 문서로 옮길 때
- 완료 이력만 남기고 축약할 때
