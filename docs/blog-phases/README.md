# Blog Phase Docs

이 디렉터리는 [blog-plan.md](../blog-plan.md)를 구현으로 옮기기 위한 phase별 상세 계획 문서를 모아둔 곳이다.

상위 문서와 하위 문서의 역할은 다음처럼 나눈다.

- `docs/blog-plan.md`: 블로그의 목표, 권한, 정보 구조, 핵심 정책, 범위 경계
- `docs/blog-phases/*`: 각 phase에서 실제로 무엇을 만들고, 무엇을 만들지 않으며, 어떤 완료 조건을 만족해야 하는지

## 읽는 순서

1. [blog-plan.md](../blog-plan.md)
2. [Phase 0 - Foundation](./phase-0-foundation.md)
3. [Phase 1 - Public Reading](./phase-1-public-reading.md)
4. [Phase 2 - Owner Authoring](./phase-2-owner-authoring.md)
5. [Phase 3 - Engagement](./phase-3-engagement.md)
6. [Phase 4 - Operations](./phase-4-operations.md)

## 문서 사용 원칙

- 구현을 시작하기 전에는 먼저 상위 기준 문서와 해당 phase 문서를 함께 확인한다.
- 하위 phase 문서가 상위 문서와 충돌하면 상위 문서를 기준으로 판단한다.
- 새 요구사항이 생기면 먼저 `blog-plan.md`를 갱신할지, phase 문서만 갱신할지 구분한다.
- 하나의 작업이 두 phase에 걸치면 더 이른 phase 문서에 경계와 선행 조건을 명시한다.

## Phase 요약

| Phase | 핵심 목표 | 결과물 성격 |
| --- | --- | --- |
| Phase 0 | 블로그가 올라갈 인프라와 권한 기반을 세운다 | 기술 기반, 인증, 공용 셸 |
| Phase 1 | 비로그인 사용자도 읽을 수 있는 공개 읽기 경험을 만든다 | 목록, 상세, 시리즈 읽기 |
| Phase 2 | owner가 초안 작성과 발행을 할 수 있게 만든다 | 에디터, 작성 페이지, 발행 흐름 |
| Phase 3 | 로그인 사용자의 상호작용을 붙인다 | 좋아요, 댓글, 대댓글 |
| Phase 4 | 제품 운영 품질과 검색엔진 대응을 정리한다 | metadata, sitemap, 운영 보강 |
