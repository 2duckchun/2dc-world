# Phase 3 - Engagement

## 목표

이 phase의 목적은 로그인 사용자가 포스트에 반응할 수 있게 만드는 것이다. 읽기 중심 블로그에 최소한의 소셜 상호작용을 붙이되, owner의 작성 흐름과 공개 읽기 흐름을 해치지 않는 선에서 구현한다.

핵심 목표는 다음과 같다.

- 좋아요 toggle을 붙인다.
- 댓글과 1단계 대댓글을 붙인다.
- owner가 댓글을 관리할 수 있게 한다.
- 로그인하지 않은 사용자는 읽기만 하고, 액션은 로그인 유도로 제한한다.

## 범위

포함 항목은 다음과 같다.

- `post_likes`와 `comments` 데이터 모델
- 포스트 상세 페이지의 좋아요 UI
- 포스트 상세 페이지의 댓글/대댓글 UI
- owner 댓글 삭제 기능

제외 항목은 다음과 같다.

- 댓글 승인 큐
- 사용자 본인 댓글 수정/삭제
- 알림
- 신고 기능
- 고급 안티스팸 정책

## 데이터 모델 결정

### post_likes

좋아요는 사용자와 포스트의 관계 모델로 본다.

- 한 사용자는 한 포스트에 대해 하나의 like 상태만 가진다.
- 구현은 insert/delete toggle 방식으로 처리한다.
- 상세 페이지에서 현재 사용자의 liked 여부와 전체 like count를 함께 반환한다.

### comments

댓글은 트리형이 아니라 2단계 구조로 제한한다.

- depth `0`: 댓글
- depth `1`: 대댓글

필수 필드는 다음 수준으로 고정한다.

- `id`
- `postId`
- `authorId`
- `parentId?`
- `depth`
- `body`
- `createdAt`
- `updatedAt`
- `deletedAt?`

삭제 정책은 soft delete로 고정한다.

- owner가 삭제하면 row는 남긴다.
- 본문은 렌더 시 "삭제된 댓글입니다." 같은 placeholder로 대체한다.
- replies가 있는 부모 댓글도 스레드 구조를 유지한다.

## 상호작용 규칙

- 좋아요는 로그인 사용자 이상만 가능하다.
- 댓글과 대댓글은 로그인 사용자 이상만 가능하다.
- 비로그인 사용자는 카운트는 볼 수 있지만 액션 시 로그인 CTA를 본다.
- 대댓글은 댓글에만 달 수 있고, 대댓글에는 다시 답글을 달 수 없다.
- owner만 댓글 삭제를 할 수 있다.

## 상세 페이지 UI 계획

상호작용 모듈은 포스트 상세 페이지 하단의 client island로 구성한다.

좋아요 영역은 다음 기준을 따른다.

- 현재 사용자 liked 여부 표시
- 전체 like 수 표시
- 클릭 시 즉시 반응하는 optimistic UI 허용

댓글 영역은 다음 기준을 따른다.

- 상단에 총 댓글 수
- 댓글 작성 입력창
- 댓글 목록
- 각 댓글 아래 1단계 답글 입력 흐름

댓글 정렬은 다음으로 고정한다.

- 댓글: 오래된 순
- 대댓글: 오래된 순

이유는 대화 흐름을 위에서 아래로 읽기 쉽게 유지하기 위함이다.

## 서버 절차 설계

필수 procedure는 `src/domain/blog/procedure` 아래에서 다음 수준으로 나눈다.

- `get-post-engagement/`
- `get-comments-by-post/`
- `post-toggle-like/`
- `post-create-comment/`
- `post-reply-comment/`
- `post-delete-comment-by-owner/`

각 procedure 폴더는 다음 파일을 가진다.

- `index.ts`: procedure 구현
- `schema.ts`: Zod 기반 input/output 스키마
- `fixture.ts`: 스키마를 만족하는 대표 입력/출력 값

도메인 hook은 다음 수준으로 정리한다.

- `src/domain/blog/hook/use-post-engagement.ts`
- `src/domain/blog/hook/use-toggle-like.ts`
- `src/domain/blog/hook/use-comments-by-post.ts`
- `src/domain/blog/hook/use-create-comment.ts`
- `src/domain/blog/hook/use-reply-comment.ts`
- `src/domain/blog/hook/use-delete-comment-by-owner.ts`

절차 규칙은 다음과 같다.

- `toggleLike`, `create`, `reply`는 로그인 필요
- `deleteByOwner`는 owner 필요
- `reply`는 parent comment의 depth가 `0`인 경우에만 허용
- 삭제된 댓글에는 새 대댓글을 허용하지 않는다

입력 검증 원칙은 다음과 같다.

- 빈 문자열 댓글 금지
- 과도하게 긴 댓글 길이 제한
- post가 존재하고 published 상태인지 확인
- parent comment가 해당 post에 속하는지 확인

## 도메인과 UI 책임 배치

- `src/domain/blog/procedure/*`: 좋아요, 댓글, 대댓글, 삭제 규칙
- `src/domain/blog/hook/*`: 상세 페이지에서 재사용하는 query/mutation hook
- `src/widgets/post-engagement`: 상세 페이지 하단 상호작용 조합 UI
- `src/views/*/sections`: 타입별 상세 페이지에서 engagement 모듈 배치

읽기 페이지 자체는 계속 server component 우선으로 유지하고, 상호작용 블록만 client component로 분리한다.

## 검증 항목

- 비로그인 사용자가 좋아요/댓글 버튼을 눌렀을 때 로그인 유도로 이동하는지 확인한다.
- 로그인 사용자가 좋아요를 누르고 취소할 수 있는지 확인한다.
- 로그인 사용자가 댓글과 대댓글을 작성할 수 있는지 확인한다.
- 대댓글의 대댓글 작성이 차단되는지 확인한다.
- owner가 댓글을 삭제할 수 있는지 확인한다.
- 삭제된 댓글이 스레드 구조를 깨지 않고 placeholder로 보이는지 확인한다.
- 다른 포스트의 댓글에 잘못 답글을 다는 시도가 서버에서 차단되는지 확인한다.

## 완료 조건

- 로그인 사용자가 상세 페이지에서 좋아요와 댓글 상호작용을 할 수 있다.
- owner가 댓글 삭제를 관리할 수 있다.
- 비로그인 사용자와 일반 로그인 사용자, owner의 권한 차이가 UI와 서버 양쪽에서 일관된다.
- 상호작용 기능이 읽기 경험을 심하게 방해하지 않는다.

## 이번 phase에서 하지 않는 것

- 댓글 승인
- 사용자 프로필 페이지
- 알림 센터
- 신고/차단
- 실시간 갱신
