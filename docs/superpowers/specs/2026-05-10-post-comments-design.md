# Post Comments — Design

## Goal

Allow signed-in users to discuss posts via comments and one level of replies on
the post viewer (`PostDetailView`) shared by `post`, `log`, and `series`
routes. A single implementation covers all three content kinds, mirroring the
post-likes feature.

## Scope

In scope:

- Top-level comments on a post.
- One level of replies under a top-level comment (2-level flat structure).
- Authors can edit and soft-delete their own comments.
- Admins can soft-delete any comment.
- Anonymous visitors can read comments; writing requires GitHub sign-in.

Out of scope:

- Comments on entities other than `posts` (no comments on series itself,
  archive cards, etc.).
- Likes/reactions on comments.
- Pagination, infinite scroll, or virtualization.
- Notifications (mentions, reply alerts).
- Reporting flow or admin moderation UI beyond direct delete.
- Draft autosave.
- Comment search or analytics.

## Product Rules

- Only signed-in GitHub OAuth users can create, edit, or delete comments.
- A reply may only be attached to a top-level comment. Replies cannot have
  replies (2-level flat).
- Top-level comments and replies are both ordered by `createdAt asc` (oldest
  first).
- Editing is allowed at any time, with no time limit. Edited comments display
  a "수정됨" label.
- Deletion is soft. The row is preserved with `is_deleted = true`; the body is
  masked client-side as "삭제된 댓글입니다". Child replies remain visible.
- Admins (`session.user.role === 'admin'`) can soft-delete any comment but can
  only edit their own.
- Comment body is plain text with line breaks preserved. No Markdown, no URL
  auto-linking.
- Comments are visible to anonymous visitors; the input area shows a GitHub
  sign-in button instead of a textarea.
- Body length: 1–1000 characters after trim. Counter shown in the form.
- No pagination — all comments for a post load at once.

## Data Model

New table `post_comments`:

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `id` | text | no | PK, generated with `crypto.randomUUID()` |
| `post_id` | text | no | FK → `posts.id`, `on delete cascade` |
| `author_id` | text | no | FK → `users.id`, `on delete restrict` |
| `parent_comment_id` | text | yes | self-FK → `post_comments.id`, `on delete cascade`. `null` = top-level, set = reply |
| `body` | text | no | Plain text, 1–1000 chars after trim |
| `is_deleted` | boolean | no | default `false`. Soft-delete tombstone. |
| `created_at` | timestamp | no | default `now()` |
| `updated_at` | timestamp | no | default `now()`. Refreshed on edit and on soft-delete |

Indexes:

- `index(post_id, created_at)` — list query for a post, ordered.
- `index(parent_comment_id)` — reply lookup grouped by parent.

Constraints:

- `post_id` cascades so deleting a post cleans up its comments.
- `author_id` uses `restrict` so authorship is preserved if a user record
  somehow disappears; future user-deletion flows must mask author rather than
  cascade.
- `parent_comment_id` cascades as a safety net. Normal flow only soft-deletes
  parents, so cascade should not fire in practice.

The 2-level invariant is enforced at the application layer in
`comment.create` (a reply's parent must have `parent_comment_id IS NULL` and
`is_deleted = false`). It is not expressed as a DB check because the self-join
form is awkward and we want Korean error messages.

Soft-deleted rows keep `body` in the database for audit and potential
recovery. The API response masks `body` to an empty string and sets
`isDeleted: true`.

Drizzle relations:

- `posts ↔ postComments` (one-to-many)
- `users ↔ postComments` (one-to-many, author)
- `postComments ↔ postComments` (self, parent ↔ replies)

Migration is generated with `bun drizzle-kit generate` and committed under
`drizzle/`.

## Domain Layer

New domain folder `src/domain/comment/`:

```text
src/domain/comment/
  procedure/
    get-list/
      index.ts
      schema.ts
      fixture.ts
    post-create/
      index.ts
      schema.ts
      fixture.ts
    patch-update/
      index.ts
      schema.ts
      fixture.ts
    delete-soft-delete/
      index.ts
      schema.ts
      fixture.ts
  router.ts
```

`commentRouter` is mounted on `appRouter` as `comment`.

### Preset procedure choice

- `comment.list` uses `publicProcedure` (anonymous read).
- `comment.create`, `comment.update`, `comment.softDelete` use
  `authProcedure`. `softDelete` does not use `adminProcedure` because the
  permission is `author OR admin`, not admin-only; the OR check lives inside
  the procedure body.

### `comment.list`

- Type: query, `publicProcedure`.
- Input: `{ postId: z.string().uuid() }`.
- Output: `Comment[]` where each `Comment` is:

```ts
{
  id: string
  body: string                  // "" when isDeleted
  isDeleted: boolean
  isEdited: boolean             // updatedAt > createdAt && !isDeleted
  createdAt: Date
  author: {
    id: string
    name: string | null
    image: string | null
  } | null                      // null only as a defensive fallback; FK is restrict
  canEdit: boolean              // viewer.id === author.id && !isDeleted
  canDelete: boolean            // (viewer.id === author.id || viewer.role === 'admin') && !isDeleted
  replies: Comment[]            // populated for top-level comments only; replies have []
}
```

- Behavior:
  1. Read top-level comments: `where post_id = ? and parent_comment_id is null
     order by created_at asc`, joining `users` for author fields.
  2. Read replies: `where parent_comment_id IN (top-level ids) order by
     created_at asc`, joining `users`.
  3. Group replies under their parent by `parent_comment_id`.
  4. Compute `canEdit`, `canDelete`, `isEdited` per row using the viewer's
     session (`ctx.session?.user`). Anonymous viewers get `false` for both
     `canEdit` and `canDelete`.
  5. Mask `body` to `""` when `is_deleted`.

### `comment.create`

- Type: mutation, `authProcedure`.
- Input:
  ```ts
  {
    postId: z.string().uuid()
    parentCommentId: z.string().uuid().nullable()
    body: z.string().trim().min(1, "내용을 입력하세요").max(1000, "최대 1000자까지 입력할 수 있습니다")
  }
  ```
- Output: `{ id: string }`.
- Behavior:
  1. Verify the target post exists and `status = 'published'`. Otherwise
     `NOT_FOUND` ("게시글을 찾을 수 없습니다.").
  2. If `parentCommentId` is non-null:
     - Look up the parent comment.
     - Reject `BAD_REQUEST` if parent is missing, belongs to a different post,
       has a non-null `parent_comment_id` (i.e., is itself a reply), or is
       `is_deleted`. Each case returns a specific Korean message.
  3. INSERT the row and return `{ id }`.

### `comment.update`

- Type: mutation, `authProcedure`.
- Input: `{ commentId: z.string().uuid(), body: <same as create> }`.
- Output: `{ id: string }`.
- Behavior:
  1. Look up the comment. If missing or `is_deleted`, return `NOT_FOUND`
     ("댓글을 찾을 수 없습니다.").
  2. If `author_id !== ctx.session.user.id`, return `FORBIDDEN`
     ("본인 댓글만 수정할 수 있습니다."). Admins do **not** bypass this.
  3. UPDATE `body` and set `updated_at = now()`.

### `comment.softDelete`

- Type: mutation, `authProcedure`.
- Input: `{ commentId: z.string().uuid() }`.
- Output: `{ id: string }`.
- Behavior:
  1. Look up the comment. If missing, return `NOT_FOUND`.
  2. If already `is_deleted`, return `{ id }` without writing (idempotent).
  3. Permission: allow if `author_id === viewer.id` OR
     `viewer.role === 'admin'`. Otherwise `FORBIDDEN` ("권한이 없습니다.").
  4. UPDATE `is_deleted = true` and `updated_at = now()`. Body is preserved
     in the database.

## Frontend Layer

### Component placement

Page-specific today (only post detail uses comments), so under
`src/views/post-detail/`:

```text
src/views/post-detail/
  index.tsx                       (existing, server)
  sections/
    like-section.tsx              (existing)
    comment-section.tsx           (new, "use client")
    comment-list.tsx              (new, "use client")
    comment-item.tsx              (new, "use client")
    comment-form.tsx              (new, "use client")
```

Split rationale:

- `comment-section`: data fetching, top-level form, mutation invalidation,
  open-form coordination.
- `comment-list`: tree rendering (top-level → replies under each).
- `comment-item`: a single comment row, its own action buttons (edit, delete,
  reply toggle), and the inline edit/reply form when toggled open.
- `comment-form`: textarea + char counter + submit, used by create
  (top-level), reply, and edit modes.

`PostDetailView` (`src/views/post-detail/index.tsx`) renders
`<CommentSection postId={post.id} isAuthenticated={...} />` below the existing
`<LikeSection />`.

### Props

```ts
type CommentSectionProps = {
  postId: string
  isAuthenticated: boolean
}
```

`PostDetailView` already receives `isAuthenticated` and forwards it. No new
prop is needed: the server-rendered `canEdit`/`canDelete` per comment carry
all per-row authorization the UI needs, and `isAuthenticated` is enough to
toggle the top-level form vs sign-in button.

### Data fetching

Same pattern as `LikeSection`:

- `app/(default)/posts/[slug]/page.tsx`,
  `app/(default)/log/[slug]/page.tsx`, and
  `app/(default)/series/[series]/[slug]/page.tsx` each call
  `queryClient.prefetchQuery(trpcServerProxy.comment.list.queryOptions({ postId: post.id }))`
  alongside the existing `like.getPostStats` prefetch.
- `CommentSection` calls
  `useSuspenseQuery(trpc.comment.list.queryOptions({ postId }))`.
- The existing `<PrefetchBoundary>` wraps the section.

### Mutation sync

- `create`, `update`, `softDelete` all call
  `queryClient.invalidateQueries({ queryKey: trpc.comment.list.queryKey({ postId }) })`
  on success.
- No optimistic updates. The list re-fetches and re-renders.

### UI behavior

Anonymous:

- Comment list is rendered.
- Where the top-level form would be, render a button "댓글을 작성하려면
  로그인하세요" inside a `<form action={signInWithGitHub}>` (mirroring
  `like-section`'s anonymous branch).

Authenticated:

- Top-level form: `<textarea>` + counter "{n} / 1000" + 댓글 작성 button.
  Submit disabled when trimmed body is empty or mutation is pending.
- Per-comment actions:
  - Reply button: visible only on top-level comments and only when the parent
    is not deleted.
  - Edit button: shown when `canEdit`.
  - Delete button: shown when `canDelete`. Confirms via the standard
    `window.confirm()` dialog ("댓글을 삭제하시겠어요?").
- Open-form coordination: at most one inline form (reply OR edit) is open at a
  time across the entire section. Opening a new one closes any existing one.
  Implemented via a single `openFormKey` state in `comment-section`.
- While a mutation is pending on a comment, its action buttons and form are
  disabled.

Visual:

- Top-level comment row: avatar (left) + name + formatted `createdAt`
  (`Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" })`)
  + "수정됨" label when `isEdited`.
- Reply row: same layout, indented (e.g. `pl-8`) under its parent.
- Soft-deleted row: body slot rendered as muted "삭제된 댓글입니다";
  edit/delete/reply buttons are not rendered. Replies under it still render
  normally.
- Author null fallback: name slot shows "(알 수 없음)". This branch should
  not fire today but keeps the UI type-safe.

Body rendering: `<p className="whitespace-pre-wrap break-words">{body}</p>`.
No Markdown, no URL auto-linking.

### Form validation

- Client mirrors the Zod rules: trim then `min(1).max(1000)`. Submit disabled
  when invalid; the counter turns red when over 1000.
- On mutation error, display the message inline below the form. Preserve the
  textarea content so the user does not lose input.
- No toast — the repo has no toast infrastructure today.

## Error Handling and Concurrency

Defense layers:

| Layer | Behavior |
| --- | --- |
| UI | Anonymous: form replaced by sign-in button. Authenticated: edit/delete buttons rendered only when server says `canEdit`/`canDelete`. |
| tRPC | `authProcedure` blocks anonymous mutations. `update` rechecks author. `softDelete` rechecks author-or-admin. `create` rechecks parent validity and post status. |

Post status:

- `comment.list` does not gate on post status; the detail page already filters
  out non-published posts.
- `comment.create` requires `posts.status = 'published'`.
- `comment.update` and `comment.softDelete` do not gate on post status, so
  authors can clean up comments on archived posts.

Concurrency:

- Double-submit: the form disables itself while a mutation is pending.
- Edit-vs-delete race (different tabs): `update` rejects deleted comments with
  `NOT_FOUND`. The client surfaces the message and invalidates.
- Reply on a comment soft-deleted in another tab: `create` rejects with
  `BAD_REQUEST` because the parent must be `is_deleted = false`.
- No DB-level uniqueness on comment rows; no extra isolation needed.

Error message mapping (procedure → user-facing text):

| Code | Context | Message |
| --- | --- | --- |
| `UNAUTHORIZED` | mutation without session | "로그인이 필요합니다." |
| `FORBIDDEN` | update by non-author | "본인 댓글만 수정할 수 있습니다." |
| `FORBIDDEN` | softDelete by non-author non-admin | "권한이 없습니다." |
| `NOT_FOUND` | post missing or unpublished on create | "게시글을 찾을 수 없습니다." |
| `NOT_FOUND` | comment missing or deleted on update | "댓글을 찾을 수 없습니다." |
| `BAD_REQUEST` | parent is a reply / different post / deleted | Specific Korean message per case |
| `BAD_REQUEST` | Zod failure | The Zod message itself ("내용을 입력하세요" / "최대 1000자까지 입력할 수 있습니다") |

## Verification

The repo has no automated test suite for tRPC procedures or React views, so
verification is manual:

1. Sign in as a GitHub user. On a post, log, and series post, create a
   top-level comment. Each appears immediately and persists across reload.
2. Reply to a comment. The reply is indented under the parent. The reply
   itself shows no further "답글" button.
3. Edit one of your own comments. The "수정됨" label appears.
4. Delete one of your own comments that has a reply. The body becomes "삭제된
   댓글입니다"; the reply remains visible.
5. Delete one of your own comments that has no reply. Body is masked the same
   way.
6. Sign out. The list is still readable; the input area shows the GitHub
   sign-in button.
7. Sign in as a second GitHub user. Try to edit user A's comment — buttons
   are not rendered, and a manual mutation call (e.g. via devtools) returns
   `FORBIDDEN`.
8. As an admin, delete user A's comment. Soft-delete succeeds.
9. Try to submit a 1001-character body. Counter blocks; if forced via the
   network, server returns the Zod message.
10. Switch a post to `archived` via SQL. Existing comments remain editable;
    new comment creation rejects with `NOT_FOUND`.
11. Hard-delete a post via SQL. Its `post_comments` rows disappear (cascade).

## Future Extensions

- Promote `comment-section` and friends to `src/widgets/` if comments are
  added to other surfaces.
- Pagination on top-level comments when single posts exceed roughly 100
  comments — keep `comment.list` shape compatible by adding cursor input.
- Comment likes or reactions, with a parallel `post_comment_likes` table.
- Mention parsing and notifications.
- Admin moderation UI (list flagged comments, restore soft-deleted).
- Markdown body, with a preview tab and shared sanitize pipeline.
- User soft-delete: replace removed user's `name`/`image` with a tombstone
  rather than restricting deletion.
