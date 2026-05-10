# Post Likes — Design

## Goal

Allow signed-in users to like posts. The like control appears at the bottom of
the post viewer (`PostDetailView`) which is shared by `post`, `log`, and
`series` post routes, so a single implementation covers all three content
kinds.

## Scope

In scope:

- Toggle like / unlike for the three content kinds backed by the `posts` table.
- Render a heart icon and like count under the post body.
- Anonymous visitors can read the count and see the button; clicking sends them
  to GitHub sign-in.

Out of scope:

- Likes on comments, archive cards, or anywhere outside the post detail view.
- Realtime updates from other users (counts refresh on next page load).
- Notifications, "posts I liked" listing, or any aggregation surface beyond the
  detail page.

## Product Rules

- Only signed-in users (GitHub OAuth) can toggle a like.
- A given user can like a given post at most once. Clicking again removes the
  like.
- The count and button are visible to everyone, including anonymous visitors.
- Anonymous click on the button triggers GitHub sign-in via Auth.js
  (`signIn("github")`); no like is recorded until the user signs in and clicks
  again.
- Likes apply uniformly to `post`, `log`, and `series` rows because all three
  live in `posts`. No `kind` branching is needed for the like flow itself.

## Data Model

New table `post_likes`:

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `post_id` | text | no | FK → `posts.id`, `on delete cascade` |
| `user_id` | text | no | FK → `users.id`, `on delete cascade` |
| `created_at` | timestamp | no | default `now()` |

Constraints and indexes:

- Primary key: `(post_id, user_id)` — prevents duplicate likes by the same user
  on the same post.
- Secondary index on `post_id` alone — supports fast `COUNT(*)` per post for
  the detail view.
- Both foreign keys cascade so deleting a post or user cleans up like rows
  without orphans.

Drizzle relations:

- `posts` ↔ `postLikes` (one-to-many)
- `users` ↔ `postLikes` (one-to-many)

Migration is generated with `bun drizzle-kit generate` and committed under
`drizzle/`.

## Domain Layer

New domain folder `src/domain/like/`:

```text
src/domain/like/
  procedure/
    post-toggle-post-like/
      index.ts
      schema.ts
      fixture.ts
  hook/
    use-toggle-post-like.ts
  router.ts
```

### Procedure: `like.togglePostLike`

- Built on `authProcedure`, so unauthenticated calls return `UNAUTHORIZED`.
- Input: `{ postId: string }`.
- Output: `{ liked: boolean, likeCount: number }` — the post-toggle state and
  the fresh aggregate count.
- Behavior, in a single DB transaction:
  1. Verify the target post exists and is `published`. If not, throw
     `NOT_FOUND`.
  2. Attempt `INSERT ... ON CONFLICT (post_id, user_id) DO NOTHING`.
     - If a row was inserted, `liked = true`.
     - Otherwise, `DELETE` the existing row and `liked = false`.
  3. `SELECT COUNT(*)` for the post inside the same transaction and return it
     as `likeCount`.

### Read-side changes

`getPostDetail`, `getLogDetail`, and `getSeriesPostDetail` are extended to
return:

- `likeCount: number` — total count for the post.
- `likedByMe: boolean` — `true` only when the caller has a session and a
  matching `post_likes` row exists. `false` for anonymous callers.

Implementation note: these procedures stay on `publicProcedure`. They look at
`ctx.session?.user?.id`; if absent, `likedByMe` is forced to `false` without a
join.

### Router wiring

A new `likeRouter` is added to `appRouter` as `like`.

## Frontend Layer

### Component placement

The like UI is page-specific (used only on the post detail surface today), so
it lives under `src/views/post-detail/`:

```text
src/views/post-detail/
  index.tsx                 (Server Component, existing)
  sections/
    like-section.tsx        ("use client", new)
```

If the same control is later reused on cards or archive pages, it is promoted
to `src/widgets/`.

### Props and rendering

`LikeSection` props:

- `postId: string`
- `initialLikeCount: number`
- `initialLikedByMe: boolean`
- `isAuthenticated: boolean`

Visual:

- A single line under the post body card, containing a `Heart` icon
  (`lucide-react`) and the count, e.g. `♥ 24`.
- When `liked` is true, the heart is filled with the accent/red color.
  Otherwise it is outlined.
- Disabled while a mutation is in flight to prevent double-fire.

### Click behavior

- If `isAuthenticated` is false, click calls `signIn("github")` from
  `next-auth/react`. No mutation runs.
- If `isAuthenticated` is true, the click toggles local state optimistically:
  `liked` flips and `likeCount` is bumped by ±1. Then the `togglePostLike`
  mutation fires.
- On success, the server response (`liked`, `likeCount`) overwrites local
  state — this corrects any drift if the optimistic guess was wrong.
- On failure, the optimistic change is rolled back. No toast; the failure is
  silent because the like is non-critical.

### Server-to-client wiring

The three `app/.../page.tsx` entries already use `trpcServerCaller` to fetch
post detail. The shape returned by those callers now includes `id`,
`likeCount`, and `likedByMe`. The page reads the session via `auth()` and
passes `isAuthenticated` plus the like fields into `PostDetailView`, which
forwards them to `LikeSection`.

## Error Handling and Concurrency

- Anonymous clicks never reach the API; they trigger sign-in instead. The
  `authProcedure` middleware is a second line of defense.
- Lookup of a missing or non-`published` post returns `NOT_FOUND`.
- Concurrent double-clicks by the same user are handled at the database layer
  by the `(post_id, user_id)` primary key plus `ON CONFLICT DO NOTHING`. The
  client also disables the button while a mutation is in flight.
- `COUNT(*)` runs inside the same transaction as the toggle so the returned
  count reflects the post-mutation state.

## Verification

There is no automated test suite for tRPC procedures or React views in this
repo today, so verification is manual:

1. Sign in as a GitHub user; like a post, a log, and a series post. Each
   count increments by one and persists across reload.
2. Click again on the same post; the count decrements and the heart un-fills.
3. Sign out and click the heart; the GitHub sign-in flow opens.
4. Sign in as a second GitHub user and like the same post; the count
   increments to two.
5. Delete a liked post via SQL or the admin flow; confirm `post_likes` rows
   for that post are gone (cascade).

## Future Extensions

- Promote `LikeSection` to `src/widgets/` when archive cards or list views
  also need a like control.
- Add a denormalized `posts.like_count` column with transactional sync if
  `COUNT(*)` becomes a measurable bottleneck.
- Add a "posts I liked" page driven by an index on `post_likes(user_id,
  created_at desc)`.
