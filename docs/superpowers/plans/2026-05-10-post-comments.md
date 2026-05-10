# Post Comments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add post comments (top-level + 1 level of replies, edit, soft-delete) to the shared `PostDetailView` so post/log/series detail pages all gain commenting.

**Architecture:** New `post_comments` table with self-referencing `parent_comment_id`. App-level enforces 2-level invariant. Domain procedures in `src/domain/comment/`. Frontend section under `src/views/post-detail/sections/` with a single `useSuspenseQuery(comment.list)` hydrated by server-side prefetch on each detail page (matches the post-likes pattern).

**Tech Stack:** Drizzle ORM (PostgreSQL), tRPC, TanStack Query, Next.js App Router, Tailwind, lucide-react.

**Spec:** `docs/superpowers/specs/2026-05-10-post-comments-design.md`

---

## File Structure

**Create:**
- `drizzle/0004_<auto-named>.sql` (generated migration)
- `drizzle/meta/_journal.json` (regenerated)
- `drizzle/meta/0004_snapshot.json` (regenerated)
- `src/domain/comment/router.ts`
- `src/domain/comment/procedure/get-list/{index,schema,fixture}.ts`
- `src/domain/comment/procedure/post-create-comment/{index,schema,fixture}.ts`
- `src/domain/comment/procedure/post-update-comment/{index,schema,fixture}.ts`
- `src/domain/comment/procedure/post-soft-delete-comment/{index,schema,fixture}.ts`
- `src/views/post-detail/sections/comment-section.tsx`
- `src/views/post-detail/sections/comment-list.tsx`
- `src/views/post-detail/sections/comment-item.tsx`
- `src/views/post-detail/sections/comment-form.tsx`

**Modify:**
- `src/core/db/schema.ts` (add `postComments` table + relations)
- `src/core/trpc/router.ts` (mount `commentRouter`)
- `src/app/(default)/posts/[slug]/page.tsx` (prefetch comment.list)
- `src/app/(default)/log/[slug]/page.tsx` (prefetch comment.list)
- `src/app/(default)/series/[series]/[slug]/page.tsx` (prefetch comment.list)
- `src/views/post-detail/index.tsx` (render `<CommentSection />`)

**Convention notes:**
- Existing repo procedure folder convention is `get-*` for queries and `post-*` for ALL mutations (including delete/update). The spec's tentative `patch-*`/`delete-*` folder names are aligned to this convention in the file paths above.
- Existing schemas use `z.string().min(1, "<korean>")` rather than `.uuid()` — we follow that style for consistency.

---

## Task 1: Add `postComments` schema and relations + generate migration

**Files:**
- Modify: `src/core/db/schema.ts`
- Create: `drizzle/0004_<auto-named>.sql` (via drizzle-kit)
- Modify: `drizzle/meta/_journal.json`, `drizzle/meta/0004_snapshot.json` (via drizzle-kit)

**Goal:** Land the table, its self-FK, indexes, and Drizzle relations. Generate and commit the migration.

- [ ] **Step 1: Add the table to `src/core/db/schema.ts`**

Append after the existing `postLikes` block (~line 196), before the `usersRelations` block:

```ts
export const postComments = pgTable(
  "post_comments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    parentCommentId: text("parent_comment_id").references(
      (): AnyPgColumn => postComments.id,
      { onDelete: "cascade" },
    ),
    body: text("body").notNull(),
    isDeleted: boolean("is_deleted").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (postComment) => [
    index("post_comments_post_id_created_at_idx").on(
      postComment.postId,
      postComment.createdAt,
    ),
    index("post_comments_parent_comment_id_idx").on(postComment.parentCommentId),
  ],
)
```

Add the `AnyPgColumn` type import to the existing `drizzle-orm/pg-core` import line (top of file):

```ts
import {
  type AnyPgColumn,
  boolean,
  check,
  index,
  // ...rest unchanged
} from "drizzle-orm/pg-core"
```

- [ ] **Step 2: Add relations**

Extend `usersRelations` (currently around line 198) to include comments:

```ts
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  authenticators: many(authenticators),
  posts: many(posts),
  postLikes: many(postLikes),
  postComments: many(postComments),
}))
```

Extend `postsRelations` similarly:

```ts
export const postsRelations = relations(posts, ({ many, one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  series: one(series, {
    fields: [posts.seriesId],
    references: [series.id],
  }),
  postTags: many(postTags),
  postLikes: many(postLikes),
  postComments: many(postComments),
}))
```

Append a new `postCommentsRelations` block at the end of the file:

```ts
export const postCommentsRelations = relations(
  postComments,
  ({ one, many }) => ({
    post: one(posts, {
      fields: [postComments.postId],
      references: [posts.id],
    }),
    author: one(users, {
      fields: [postComments.authorId],
      references: [users.id],
    }),
    parent: one(postComments, {
      fields: [postComments.parentCommentId],
      references: [postComments.id],
      relationName: "comment_replies",
    }),
    replies: many(postComments, {
      relationName: "comment_replies",
    }),
  }),
)
```

- [ ] **Step 3: Generate migration**

Run: `bun drizzle-kit generate`

Expected: a new file `drizzle/0004_<auto-named>.sql` is created and `drizzle/meta/_journal.json` is updated. Open the SQL and verify:
- `CREATE TABLE "post_comments"` with the expected columns.
- Foreign keys: `post_id` cascades, `author_id` restrict, `parent_comment_id` self-FK cascade.
- Indexes `post_comments_post_id_created_at_idx` and `post_comments_parent_comment_id_idx` exist.

If anything is wrong, fix the schema and re-run. Don't hand-edit the migration.

- [ ] **Step 4: Apply migration locally**

Run: `bun drizzle-kit migrate`

Expected: migration applies without error. Verify by connecting to the dev DB and listing tables, or by re-running and confirming "no migrations to apply".

- [ ] **Step 5: Commit**

```bash
git add src/core/db/schema.ts drizzle/
git commit -m "$(cat <<'EOF'
feature: add post comments schema

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Add `comment.list` query procedure + router

**Files:**
- Create: `src/domain/comment/procedure/get-list/schema.ts`
- Create: `src/domain/comment/procedure/get-list/fixture.ts`
- Create: `src/domain/comment/procedure/get-list/index.ts`
- Create: `src/domain/comment/router.ts`
- Modify: `src/core/trpc/router.ts`

**Goal:** Anonymous-readable nested list of comments + replies for a post, with `canEdit`/`canDelete` flags pre-computed for the viewer.

- [ ] **Step 1: Write `schema.ts`**

```ts
// src/domain/comment/procedure/get-list/schema.ts
import { z } from "zod"

const commentAuthorSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  image: z.string().nullable(),
})

const commentBaseSchema = z.object({
  id: z.string(),
  body: z.string(),
  isDeleted: z.boolean(),
  isEdited: z.boolean(),
  createdAt: z.date(),
  author: commentAuthorSchema.nullable(),
  canEdit: z.boolean(),
  canDelete: z.boolean(),
})

const commentReplySchema = commentBaseSchema

const commentTopLevelSchema = commentBaseSchema.extend({
  replies: z.array(commentReplySchema),
})

export const commentGetListInputSchema = z.object({
  postId: z.string().min(1, "게시글 식별자가 필요합니다."),
})

export const commentGetListOutputSchema = z.array(commentTopLevelSchema)

export type CommentGetListInput = z.input<typeof commentGetListInputSchema>
export type CommentGetListOutput = z.output<typeof commentGetListOutputSchema>
```

- [ ] **Step 2: Write `fixture.ts`**

```ts
// src/domain/comment/procedure/get-list/fixture.ts
import type { CommentGetListInput, CommentGetListOutput } from "./schema"

export const commentGetListInputFixture = {
  postId: "post_fixture_1",
} satisfies CommentGetListInput

export const commentGetListOutputFixture = [
  {
    id: "comment_fixture_1",
    body: "첫 댓글입니다.",
    isDeleted: false,
    isEdited: false,
    createdAt: new Date("2026-05-10T00:00:00Z"),
    author: {
      id: "user_fixture_1",
      name: "Alice",
      image: null,
    },
    canEdit: false,
    canDelete: false,
    replies: [
      {
        id: "comment_fixture_2",
        body: "대댓글입니다.",
        isDeleted: false,
        isEdited: false,
        createdAt: new Date("2026-05-10T00:01:00Z"),
        author: {
          id: "user_fixture_2",
          name: "Bob",
          image: null,
        },
        canEdit: false,
        canDelete: false,
      },
    ],
  },
] satisfies CommentGetListOutput
```

- [ ] **Step 3: Write `index.ts`**

```ts
// src/domain/comment/procedure/get-list/index.ts
import { and, asc, eq, inArray, isNull } from "drizzle-orm"
import { postComments } from "@/core/db/schema"
import { publicProcedure } from "@/core/trpc/base/procedures/public-procedure"
import {
  commentGetListInputSchema,
  commentGetListOutputSchema,
} from "./schema"

export const commentGetListProcedure = publicProcedure
  .input(commentGetListInputSchema)
  .output(commentGetListOutputSchema)
  .query(async ({ ctx, input }) => {
    const viewer = ctx.session?.user ?? null
    const viewerId = viewer?.id ?? null
    const viewerIsAdmin = viewer?.role === "admin"

    const topLevelRows = await ctx.db.query.postComments.findMany({
      where: and(
        eq(postComments.postId, input.postId),
        isNull(postComments.parentCommentId),
      ),
      orderBy: asc(postComments.createdAt),
      with: {
        author: {
          columns: { id: true, name: true, image: true },
        },
      },
    })

    const replyRows = topLevelRows.length
      ? await ctx.db.query.postComments.findMany({
          where: inArray(
            postComments.parentCommentId,
            topLevelRows.map((row) => row.id),
          ),
          orderBy: asc(postComments.createdAt),
          with: {
            author: {
              columns: { id: true, name: true, image: true },
            },
          },
        })
      : []

    const repliesByParent = new Map<string, ReturnType<typeof shapeReply>[]>()

    for (const reply of replyRows) {
      if (!reply.parentCommentId) continue
      const list = repliesByParent.get(reply.parentCommentId) ?? []
      list.push(shapeReply(reply, viewerId, viewerIsAdmin))
      repliesByParent.set(reply.parentCommentId, list)
    }

    return topLevelRows.map((row) => ({
      ...shapeReply(row, viewerId, viewerIsAdmin),
      replies: repliesByParent.get(row.id) ?? [],
    }))
  })

type RowWithAuthor = {
  id: string
  body: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
  authorId: string
  author: { id: string; name: string | null; image: string | null } | null
}

function shapeReply(
  row: RowWithAuthor,
  viewerId: string | null,
  viewerIsAdmin: boolean,
) {
  const isOwner = viewerId !== null && row.authorId === viewerId

  return {
    id: row.id,
    body: row.isDeleted ? "" : row.body,
    isDeleted: row.isDeleted,
    isEdited: !row.isDeleted && row.updatedAt > row.createdAt,
    createdAt: row.createdAt,
    author: row.author,
    canEdit: !row.isDeleted && isOwner,
    canDelete: !row.isDeleted && (isOwner || viewerIsAdmin),
  }
}
```

- [ ] **Step 4: Write `router.ts`**

```ts
// src/domain/comment/router.ts
import { createTRPCRouter } from "@/core/trpc/base/init"
import { commentGetListProcedure } from "./procedure/get-list"

export const commentRouter = createTRPCRouter({
  list: commentGetListProcedure,
})
```

- [ ] **Step 5: Mount on `appRouter`**

Edit `src/core/trpc/router.ts`:

```ts
import { commentRouter } from "@/domain/comment/router"
import { contentRouter } from "@/domain/content/router"
import { likeRouter } from "@/domain/like/router"
import { postRouter } from "@/domain/post/router"
import { seriesRouter } from "@/domain/series/router"
import { createTRPCRouter } from "./base/init"

export const appRouter = createTRPCRouter({
  comment: commentRouter,
  content: contentRouter,
  like: likeRouter,
  post: postRouter,
  series: seriesRouter,
})

export type AppRouter = typeof appRouter
```

- [ ] **Step 6: Type-check**

Run: `bun typecheck` (or whatever the repo uses; check `package.json` `scripts`)
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/domain/comment src/core/trpc/router.ts
git commit -m "$(cat <<'EOF'
feature: expose comment list via tRPC query

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Add `comment.create` mutation

**Files:**
- Create: `src/domain/comment/procedure/post-create-comment/{index,schema,fixture}.ts`
- Modify: `src/domain/comment/router.ts`

**Goal:** Authenticated users can create a top-level comment or a reply (parent must be top-level + not deleted + same post).

- [ ] **Step 1: Write `schema.ts`**

```ts
// src/domain/comment/procedure/post-create-comment/schema.ts
import { z } from "zod"

export const commentBodySchema = z
  .string()
  .trim()
  .min(1, "내용을 입력하세요.")
  .max(1000, "최대 1000자까지 입력할 수 있습니다.")

export const commentCreateInputSchema = z.object({
  postId: z.string().min(1, "게시글 식별자가 필요합니다."),
  parentCommentId: z.string().min(1).nullable(),
  body: commentBodySchema,
})

export const commentCreateOutputSchema = z.object({
  id: z.string(),
})

export type CommentCreateInput = z.input<typeof commentCreateInputSchema>
export type CommentCreateOutput = z.output<typeof commentCreateOutputSchema>
```

- [ ] **Step 2: Write `fixture.ts`**

```ts
// src/domain/comment/procedure/post-create-comment/fixture.ts
import type { CommentCreateInput, CommentCreateOutput } from "./schema"

export const commentCreateInputFixture = {
  postId: "post_fixture_1",
  parentCommentId: null,
  body: "댓글 본문",
} satisfies CommentCreateInput

export const commentCreateOutputFixture = {
  id: "comment_fixture_new",
} satisfies CommentCreateOutput
```

- [ ] **Step 3: Write `index.ts`**

```ts
// src/domain/comment/procedure/post-create-comment/index.ts
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import { postComments, posts } from "@/core/db/schema"
import { authProcedure } from "@/core/trpc/base/procedures/auth-procedure"
import {
  commentCreateInputSchema,
  commentCreateOutputSchema,
} from "./schema"

export const commentCreateProcedure = authProcedure
  .input(commentCreateInputSchema)
  .output(commentCreateOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "로그인이 필요합니다.",
      })
    }

    const post = await ctx.db.query.posts.findFirst({
      columns: { id: true },
      where: and(eq(posts.id, input.postId), eq(posts.status, "published")),
    })

    if (!post) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "게시글을 찾을 수 없습니다.",
      })
    }

    if (input.parentCommentId !== null) {
      const parent = await ctx.db.query.postComments.findFirst({
        columns: {
          id: true,
          postId: true,
          parentCommentId: true,
          isDeleted: true,
        },
        where: eq(postComments.id, input.parentCommentId),
      })

      if (!parent) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "답글을 달 댓글을 찾을 수 없습니다.",
        })
      }

      if (parent.postId !== input.postId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "다른 게시글의 댓글에는 답글을 달 수 없습니다.",
        })
      }

      if (parent.parentCommentId !== null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "대댓글에는 답글을 달 수 없습니다.",
        })
      }

      if (parent.isDeleted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "삭제된 댓글에는 답글을 달 수 없습니다.",
        })
      }
    }

    const [inserted] = await ctx.db
      .insert(postComments)
      .values({
        postId: input.postId,
        authorId: userId,
        parentCommentId: input.parentCommentId,
        body: input.body,
      })
      .returning({ id: postComments.id })

    if (!inserted) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "댓글 저장에 실패했습니다.",
      })
    }

    return { id: inserted.id }
  })
```

- [ ] **Step 4: Wire into router**

Edit `src/domain/comment/router.ts`:

```ts
import { createTRPCRouter } from "@/core/trpc/base/init"
import { commentGetListProcedure } from "./procedure/get-list"
import { commentCreateProcedure } from "./procedure/post-create-comment"

export const commentRouter = createTRPCRouter({
  list: commentGetListProcedure,
  create: commentCreateProcedure,
})
```

- [ ] **Step 5: Type-check + commit**

Run: `bun typecheck`
Expected: no errors.

```bash
git add src/domain/comment
git commit -m "$(cat <<'EOF'
feature: add comment create procedure

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Add `comment.update` mutation

**Files:**
- Create: `src/domain/comment/procedure/post-update-comment/{index,schema,fixture}.ts`
- Modify: `src/domain/comment/router.ts`

**Goal:** Authors can update their own non-deleted comments. Admins are NOT permitted to edit others' content.

- [ ] **Step 1: Write `schema.ts`**

```ts
// src/domain/comment/procedure/post-update-comment/schema.ts
import { z } from "zod"
import { commentBodySchema } from "../post-create-comment/schema"

export const commentUpdateInputSchema = z.object({
  commentId: z.string().min(1, "댓글 식별자가 필요합니다."),
  body: commentBodySchema,
})

export const commentUpdateOutputSchema = z.object({
  id: z.string(),
})

export type CommentUpdateInput = z.input<typeof commentUpdateInputSchema>
export type CommentUpdateOutput = z.output<typeof commentUpdateOutputSchema>
```

- [ ] **Step 2: Write `fixture.ts`**

```ts
// src/domain/comment/procedure/post-update-comment/fixture.ts
import type { CommentUpdateInput, CommentUpdateOutput } from "./schema"

export const commentUpdateInputFixture = {
  commentId: "comment_fixture_1",
  body: "수정된 댓글",
} satisfies CommentUpdateInput

export const commentUpdateOutputFixture = {
  id: "comment_fixture_1",
} satisfies CommentUpdateOutput
```

- [ ] **Step 3: Write `index.ts`**

```ts
// src/domain/comment/procedure/post-update-comment/index.ts
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { postComments } from "@/core/db/schema"
import { authProcedure } from "@/core/trpc/base/procedures/auth-procedure"
import {
  commentUpdateInputSchema,
  commentUpdateOutputSchema,
} from "./schema"

export const commentUpdateProcedure = authProcedure
  .input(commentUpdateInputSchema)
  .output(commentUpdateOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "로그인이 필요합니다.",
      })
    }

    const existing = await ctx.db.query.postComments.findFirst({
      columns: { id: true, authorId: true, isDeleted: true },
      where: eq(postComments.id, input.commentId),
    })

    if (!existing || existing.isDeleted) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "댓글을 찾을 수 없습니다.",
      })
    }

    if (existing.authorId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "본인 댓글만 수정할 수 있습니다.",
      })
    }

    await ctx.db
      .update(postComments)
      .set({ body: input.body, updatedAt: new Date() })
      .where(eq(postComments.id, input.commentId))

    return { id: existing.id }
  })
```

- [ ] **Step 4: Wire into router**

```ts
import { createTRPCRouter } from "@/core/trpc/base/init"
import { commentGetListProcedure } from "./procedure/get-list"
import { commentCreateProcedure } from "./procedure/post-create-comment"
import { commentUpdateProcedure } from "./procedure/post-update-comment"

export const commentRouter = createTRPCRouter({
  list: commentGetListProcedure,
  create: commentCreateProcedure,
  update: commentUpdateProcedure,
})
```

- [ ] **Step 5: Type-check + commit**

```bash
bun typecheck
git add src/domain/comment
git commit -m "$(cat <<'EOF'
feature: add comment update procedure

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Add `comment.softDelete` mutation

**Files:**
- Create: `src/domain/comment/procedure/post-soft-delete-comment/{index,schema,fixture}.ts`
- Modify: `src/domain/comment/router.ts`

**Goal:** Authors can soft-delete their own comments. Admins can soft-delete any comment.

- [ ] **Step 1: Write `schema.ts`**

```ts
// src/domain/comment/procedure/post-soft-delete-comment/schema.ts
import { z } from "zod"

export const commentSoftDeleteInputSchema = z.object({
  commentId: z.string().min(1, "댓글 식별자가 필요합니다."),
})

export const commentSoftDeleteOutputSchema = z.object({
  id: z.string(),
})

export type CommentSoftDeleteInput = z.input<
  typeof commentSoftDeleteInputSchema
>
export type CommentSoftDeleteOutput = z.output<
  typeof commentSoftDeleteOutputSchema
>
```

- [ ] **Step 2: Write `fixture.ts`**

```ts
// src/domain/comment/procedure/post-soft-delete-comment/fixture.ts
import type {
  CommentSoftDeleteInput,
  CommentSoftDeleteOutput,
} from "./schema"

export const commentSoftDeleteInputFixture = {
  commentId: "comment_fixture_1",
} satisfies CommentSoftDeleteInput

export const commentSoftDeleteOutputFixture = {
  id: "comment_fixture_1",
} satisfies CommentSoftDeleteOutput
```

- [ ] **Step 3: Write `index.ts`**

```ts
// src/domain/comment/procedure/post-soft-delete-comment/index.ts
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { postComments } from "@/core/db/schema"
import { authProcedure } from "@/core/trpc/base/procedures/auth-procedure"
import {
  commentSoftDeleteInputSchema,
  commentSoftDeleteOutputSchema,
} from "./schema"

export const commentSoftDeleteProcedure = authProcedure
  .input(commentSoftDeleteInputSchema)
  .output(commentSoftDeleteOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const viewer = ctx.session?.user

    if (!viewer?.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "로그인이 필요합니다.",
      })
    }

    const existing = await ctx.db.query.postComments.findFirst({
      columns: { id: true, authorId: true, isDeleted: true },
      where: eq(postComments.id, input.commentId),
    })

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "댓글을 찾을 수 없습니다.",
      })
    }

    if (existing.isDeleted) {
      return { id: existing.id }
    }

    const isOwner = existing.authorId === viewer.id
    const isAdmin = viewer.role === "admin"

    if (!isOwner && !isAdmin) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "권한이 없습니다.",
      })
    }

    await ctx.db
      .update(postComments)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(postComments.id, input.commentId))

    return { id: existing.id }
  })
```

- [ ] **Step 4: Wire into router**

```ts
import { createTRPCRouter } from "@/core/trpc/base/init"
import { commentGetListProcedure } from "./procedure/get-list"
import { commentCreateProcedure } from "./procedure/post-create-comment"
import { commentSoftDeleteProcedure } from "./procedure/post-soft-delete-comment"
import { commentUpdateProcedure } from "./procedure/post-update-comment"

export const commentRouter = createTRPCRouter({
  list: commentGetListProcedure,
  create: commentCreateProcedure,
  update: commentUpdateProcedure,
  softDelete: commentSoftDeleteProcedure,
})
```

- [ ] **Step 5: Type-check + commit**

```bash
bun typecheck
git add src/domain/comment
git commit -m "$(cat <<'EOF'
feature: add comment soft-delete procedure

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Prefetch `comment.list` on detail pages

**Files:**
- Modify: `src/app/(default)/posts/[slug]/page.tsx`
- Modify: `src/app/(default)/log/[slug]/page.tsx`
- Modify: `src/app/(default)/series/[series]/[slug]/page.tsx`

**Goal:** Server-side prefetch the comment list alongside like stats so the client section hydrates without a flash of loading.

- [ ] **Step 1: Update each page**

In each of the three files, replace the single-prefetch block:

```ts
const queryClient = getServerQueryClient()
await queryClient.prefetchQuery(
  trpcServerProxy.like.getPostStats.queryOptions({ postId: post.id }),
)
```

with a parallel-prefetch block:

```ts
const queryClient = getServerQueryClient()
await Promise.all([
  queryClient.prefetchQuery(
    trpcServerProxy.like.getPostStats.queryOptions({ postId: post.id }),
  ),
  queryClient.prefetchQuery(
    trpcServerProxy.comment.list.queryOptions({ postId: post.id }),
  ),
])
```

The three exact files: `posts/[slug]/page.tsx`, `log/[slug]/page.tsx`, `series/[series]/[slug]/page.tsx` (under `src/app/(default)/`).

- [ ] **Step 2: Type-check + commit**

```bash
bun typecheck
git add src/app/\(default\)/posts/\[slug\]/page.tsx src/app/\(default\)/log/\[slug\]/page.tsx src/app/\(default\)/series/\[series\]/\[slug\]/page.tsx
git commit -m "$(cat <<'EOF'
feature: prefetch post comments on detail pages

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Build `CommentForm` (textarea + counter + submit)

**Files:**
- Create: `src/views/post-detail/sections/comment-form.tsx`

**Goal:** A reusable controlled form used by the top-level create flow, the inline reply flow, and the inline edit flow. No data fetching — receives `onSubmit`, `onCancel`, `submitLabel`, optional `initialBody`, and a `pending` flag from the parent.

- [ ] **Step 1: Write the file**

```tsx
// src/views/post-detail/sections/comment-form.tsx
"use client"

import { useState } from "react"
import { cn } from "@/shared/lib/utils"

const MAX_BODY_LENGTH = 1000

type CommentFormProps = {
  initialBody?: string
  submitLabel: string
  pending: boolean
  errorMessage?: string | null
  onSubmit: (body: string) => void
  onCancel?: () => void
  autoFocus?: boolean
}

export function CommentForm({
  initialBody = "",
  submitLabel,
  pending,
  errorMessage = null,
  onSubmit,
  onCancel,
  autoFocus = false,
}: CommentFormProps) {
  const [body, setBody] = useState(initialBody)

  const trimmed = body.trim()
  const tooLong = body.length > MAX_BODY_LENGTH
  const canSubmit = trimmed.length > 0 && !tooLong && !pending

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    onSubmit(trimmed)
  }

  return (
    <form className="grid gap-2" onSubmit={handleSubmit}>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={3}
        autoFocus={autoFocus}
        disabled={pending}
        className={cn(
          "w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
        placeholder="댓글을 입력하세요"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span
          className={cn(
            "text-muted-foreground",
            tooLong && "font-medium text-red-500",
          )}
        >
          {body.length.toLocaleString("ko-KR")} / {MAX_BODY_LENGTH.toLocaleString("ko-KR")}
        </span>
        <div className="flex items-center gap-2">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={pending}
              className="rounded-md border border-border bg-background px-3 py-1.5 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              취소
            </button>
          ) : null}
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-md border border-border bg-foreground px-3 py-1.5 text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLabel}
          </button>
        </div>
      </div>
      {errorMessage ? (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      ) : null}
    </form>
  )
}
```

- [ ] **Step 2: Type-check + commit**

```bash
bun typecheck
git add src/views/post-detail/sections/comment-form.tsx
git commit -m "$(cat <<'EOF'
feature: add comment form component

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Build `CommentItem` (single comment + actions)

**Files:**
- Create: `src/views/post-detail/sections/comment-item.tsx`

**Goal:** Render a single comment row, conditionally show edit/delete/reply buttons, and host the inline edit form when active. Receives data + callback handlers from `CommentSection`. Stateless about which form is open across siblings — that lives in the parent.

- [ ] **Step 1: Write the file**

```tsx
// src/views/post-detail/sections/comment-item.tsx
"use client"

import Image from "next/image"
import { CommentForm } from "./comment-form"

const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
})

export type CommentForView = {
  id: string
  body: string
  isDeleted: boolean
  isEdited: boolean
  createdAt: Date
  author: { id: string; name: string | null; image: string | null } | null
  canEdit: boolean
  canDelete: boolean
}

type CommentItemProps = {
  comment: CommentForView
  isReply: boolean
  isEditing: boolean
  editError: string | null
  editPending: boolean
  deletePending: boolean
  canReply: boolean
  onStartEdit: () => void
  onCancelEdit: () => void
  onSubmitEdit: (body: string) => void
  onDelete: () => void
  onStartReply: () => void
}

export function CommentItem({
  comment,
  isReply,
  isEditing,
  editError,
  editPending,
  deletePending,
  canReply,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
  onDelete,
  onStartReply,
}: CommentItemProps) {
  const authorName = comment.author?.name ?? "(알 수 없음)"
  const authorImage = comment.author?.image ?? null
  const formattedDate = dateTimeFormatter.format(comment.createdAt)
  const showActions = !comment.isDeleted && !isEditing

  return (
    <article className={isReply ? "pl-8" : undefined}>
      <div className="flex gap-3">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
          {authorImage ? (
            <Image
              src={authorImage}
              alt=""
              fill
              sizes="32px"
              className="object-cover"
              unoptimized
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1 grid gap-1">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
            <span className="font-medium text-foreground">{authorName}</span>
            <span>·</span>
            <span>{formattedDate}</span>
            {comment.isEdited ? <span>· 수정됨</span> : null}
          </div>

          {comment.isDeleted ? (
            <p className="text-muted-foreground text-sm italic">삭제된 댓글입니다.</p>
          ) : isEditing ? (
            <CommentForm
              initialBody={comment.body}
              submitLabel="수정"
              pending={editPending}
              errorMessage={editError}
              onSubmit={onSubmitEdit}
              onCancel={onCancelEdit}
              autoFocus
            />
          ) : (
            <p className="whitespace-pre-wrap break-words text-sm">{comment.body}</p>
          )}

          {showActions ? (
            <div className="flex flex-wrap gap-3 text-muted-foreground text-xs">
              {canReply ? (
                <button
                  type="button"
                  onClick={onStartReply}
                  disabled={deletePending}
                  className="transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                  답글
                </button>
              ) : null}
              {comment.canEdit ? (
                <button
                  type="button"
                  onClick={onStartEdit}
                  disabled={deletePending}
                  className="transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                  수정
                </button>
              ) : null}
              {comment.canDelete ? (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={deletePending}
                  className="transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                  삭제
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Type-check + commit**

```bash
bun typecheck
git add src/views/post-detail/sections/comment-item.tsx
git commit -m "$(cat <<'EOF'
feature: add comment item component

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Build `CommentList` + `CommentSection` and wire into `PostDetailView`

**Files:**
- Create: `src/views/post-detail/sections/comment-list.tsx`
- Create: `src/views/post-detail/sections/comment-section.tsx`
- Modify: `src/views/post-detail/index.tsx`

**Goal:** Hydrate the prefetched query, manage which inline form is open across the whole list, run the three mutations with invalidation, and render the tree below the like section.

- [ ] **Step 1: Write `comment-list.tsx`**

```tsx
// src/views/post-detail/sections/comment-list.tsx
"use client"

import { CommentItem, type CommentForView } from "./comment-item"
import { CommentForm } from "./comment-form"

export type CommentTreeNode = CommentForView & {
  replies: CommentForView[]
}

type OpenForm =
  | { kind: "edit"; commentId: string }
  | { kind: "reply"; commentId: string }
  | null

type CommentListProps = {
  comments: CommentTreeNode[]
  openForm: OpenForm
  pendingId: string | null
  pendingKind: "edit" | "reply" | "delete" | null
  inlineErrorByCommentId: Record<string, string | null>
  onStartEdit: (commentId: string) => void
  onCancelEdit: () => void
  onSubmitEdit: (commentId: string, body: string) => void
  onDelete: (commentId: string) => void
  onStartReply: (commentId: string) => void
  onCancelReply: () => void
  onSubmitReply: (parentCommentId: string, body: string) => void
}

export function CommentList({
  comments,
  openForm,
  pendingId,
  pendingKind,
  inlineErrorByCommentId,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
  onDelete,
  onStartReply,
  onCancelReply,
  onSubmitReply,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">아직 댓글이 없습니다.</p>
    )
  }

  return (
    <ul className="grid gap-6">
      {comments.map((comment) => {
        const isEditing =
          openForm?.kind === "edit" && openForm.commentId === comment.id
        const isReplying =
          openForm?.kind === "reply" && openForm.commentId === comment.id

        return (
          <li key={comment.id} className="grid gap-4">
            <CommentItem
              comment={comment}
              isReply={false}
              isEditing={isEditing}
              editError={
                isEditing ? inlineErrorByCommentId[comment.id] ?? null : null
              }
              editPending={pendingKind === "edit" && pendingId === comment.id}
              deletePending={
                pendingKind === "delete" && pendingId === comment.id
              }
              canReply={!comment.isDeleted}
              onStartEdit={() => onStartEdit(comment.id)}
              onCancelEdit={onCancelEdit}
              onSubmitEdit={(body) => onSubmitEdit(comment.id, body)}
              onDelete={() => onDelete(comment.id)}
              onStartReply={() => onStartReply(comment.id)}
            />

            {isReplying ? (
              <div className="pl-11">
                <CommentForm
                  submitLabel="답글 작성"
                  pending={pendingKind === "reply" && pendingId === comment.id}
                  errorMessage={inlineErrorByCommentId[comment.id] ?? null}
                  onSubmit={(body) => onSubmitReply(comment.id, body)}
                  onCancel={onCancelReply}
                  autoFocus
                />
              </div>
            ) : null}

            {comment.replies.length > 0 ? (
              <ul className="grid gap-6">
                {comment.replies.map((reply) => {
                  const isReplyEditing =
                    openForm?.kind === "edit" &&
                    openForm.commentId === reply.id

                  return (
                    <li key={reply.id}>
                      <CommentItem
                        comment={reply}
                        isReply
                        isEditing={isReplyEditing}
                        editError={
                          isReplyEditing
                            ? inlineErrorByCommentId[reply.id] ?? null
                            : null
                        }
                        editPending={
                          pendingKind === "edit" && pendingId === reply.id
                        }
                        deletePending={
                          pendingKind === "delete" && pendingId === reply.id
                        }
                        canReply={false}
                        onStartEdit={() => onStartEdit(reply.id)}
                        onCancelEdit={onCancelEdit}
                        onSubmitEdit={(body) => onSubmitEdit(reply.id, body)}
                        onDelete={() => onDelete(reply.id)}
                        onStartReply={() => {}}
                      />
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
```

- [ ] **Step 2: Write `comment-section.tsx`**

```tsx
// src/views/post-detail/sections/comment-section.tsx
"use client"

import { TRPCClientError } from "@trpc/client"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useState } from "react"
import { signInWithGitHub } from "@/core/auth/actions"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { CommentForm } from "./comment-form"
import { CommentList, type CommentTreeNode } from "./comment-list"

type CommentSectionProps = {
  postId: string
  isAuthenticated: boolean
}

type OpenForm =
  | { kind: "edit"; commentId: string }
  | { kind: "reply"; commentId: string }
  | null

export function CommentSection({
  postId,
  isAuthenticated,
}: CommentSectionProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const queryOptions = trpc.comment.list.queryOptions({ postId })
  const { data } = useSuspenseQuery(queryOptions)
  const comments = data as CommentTreeNode[]

  const [openForm, setOpenForm] = useState<OpenForm>(null)
  const [topLevelError, setTopLevelError] = useState<string | null>(null)
  const [inlineErrorByCommentId, setInlineErrorByCommentId] = useState<
    Record<string, string | null>
  >({})

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryOptions.queryKey })

  const errorMessageOf = (error: unknown) =>
    error instanceof TRPCClientError ? error.message : "요청에 실패했습니다."

  const setInlineError = (commentId: string, message: string | null) => {
    setInlineErrorByCommentId((current) => ({
      ...current,
      [commentId]: message,
    }))
  }

  const createMutation = useMutation(
    trpc.comment.create.mutationOptions({
      onSuccess: () => {
        invalidate()
        setOpenForm(null)
        setTopLevelError(null)
      },
    }),
  )

  const updateMutation = useMutation(
    trpc.comment.update.mutationOptions({
      onSuccess: (_data, variables) => {
        invalidate()
        setOpenForm(null)
        setInlineError(variables.commentId, null)
      },
    }),
  )

  const softDeleteMutation = useMutation(
    trpc.comment.softDelete.mutationOptions({
      onSuccess: (_data, variables) => {
        invalidate()
        setInlineError(variables.commentId, null)
      },
    }),
  )

  const pendingId =
    updateMutation.isPending && updateMutation.variables
      ? updateMutation.variables.commentId
      : softDeleteMutation.isPending && softDeleteMutation.variables
        ? softDeleteMutation.variables.commentId
        : createMutation.isPending && createMutation.variables?.parentCommentId
          ? createMutation.variables.parentCommentId
          : null

  const pendingKind: "edit" | "reply" | "delete" | null = updateMutation.isPending
    ? "edit"
    : softDeleteMutation.isPending
      ? "delete"
      : createMutation.isPending && createMutation.variables?.parentCommentId
        ? "reply"
        : null

  const submitTopLevel = (body: string) => {
    setTopLevelError(null)
    createMutation.mutate(
      { postId, parentCommentId: null, body },
      {
        onError: (error) => setTopLevelError(errorMessageOf(error)),
      },
    )
  }

  const submitReply = (parentCommentId: string, body: string) => {
    setInlineError(parentCommentId, null)
    createMutation.mutate(
      { postId, parentCommentId, body },
      {
        onError: (error) =>
          setInlineError(parentCommentId, errorMessageOf(error)),
      },
    )
  }

  const submitEdit = (commentId: string, body: string) => {
    setInlineError(commentId, null)
    updateMutation.mutate(
      { commentId, body },
      {
        onError: (error) => setInlineError(commentId, errorMessageOf(error)),
      },
    )
  }

  const handleDelete = (commentId: string) => {
    if (!window.confirm("댓글을 삭제하시겠어요?")) return
    setInlineError(commentId, null)
    softDeleteMutation.mutate(
      { commentId },
      {
        onError: (error) => setInlineError(commentId, errorMessageOf(error)),
      },
    )
  }

  return (
    <section className="grid gap-6 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-8">
      <h2 className="font-semibold text-lg">댓글</h2>

      {isAuthenticated ? (
        <CommentForm
          submitLabel="댓글 작성"
          pending={createMutation.isPending && !createMutation.variables?.parentCommentId}
          errorMessage={topLevelError}
          onSubmit={submitTopLevel}
        />
      ) : (
        <form action={signInWithGitHub}>
          <button
            type="submit"
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm transition hover:bg-muted"
          >
            댓글을 작성하려면 로그인하세요
          </button>
        </form>
      )}

      <CommentList
        comments={comments}
        openForm={openForm}
        pendingId={pendingId}
        pendingKind={pendingKind}
        inlineErrorByCommentId={inlineErrorByCommentId}
        onStartEdit={(commentId) =>
          setOpenForm({ kind: "edit", commentId })
        }
        onCancelEdit={() => setOpenForm(null)}
        onSubmitEdit={submitEdit}
        onDelete={handleDelete}
        onStartReply={(commentId) =>
          setOpenForm({ kind: "reply", commentId })
        }
        onCancelReply={() => setOpenForm(null)}
        onSubmitReply={submitReply}
      />
    </section>
  )
}
```

- [ ] **Step 3: Wire into `PostDetailView`**

Edit `src/views/post-detail/index.tsx`. Add import:

```ts
import { CommentSection } from "./sections/comment-section"
```

And below the existing `<LikeSection />` block, add:

```tsx
<CommentSection postId={post.id} isAuthenticated={isAuthenticated} />
```

Final relevant section of `index.tsx`:

```tsx
      <div className="flex justify-center">
        <LikeSection postId={post.id} isAuthenticated={isAuthenticated} />
      </div>

      <CommentSection postId={post.id} isAuthenticated={isAuthenticated} />
    </div>
  )
}
```

- [ ] **Step 4: Type-check**

```bash
bun typecheck
```

Expected: no errors.

- [ ] **Step 5: Manual smoke test**

Start dev server: `bun dev`. As an authenticated user:

1. Open a published post detail page.
2. Add a top-level comment, verify it shows immediately after refetch.
3. Add a reply, verify it appears indented under the parent.
4. Edit your own comment, verify "수정됨" appears.
5. Delete your own comment that has a reply, verify body becomes "삭제된 댓글입니다" while reply remains.
6. Sign out, verify the form area shows the GitHub sign-in button and the list still renders.

If any step fails, debug before committing.

- [ ] **Step 6: Commit**

```bash
git add src/views/post-detail
git commit -m "$(cat <<'EOF'
feature: render comment section on post detail view

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Verification (manual, full sweep)

After all tasks land, walk through the spec's verification list end-to-end:

1. Sign in. Comment on a `post`, a `log`, and a `series` post. Each persists across reload.
2. Reply to one of those comments. Reply has no further "답글" button.
3. Edit a comment. "수정됨" label shown.
4. Delete a comment that has a reply. Body masked, reply intact.
5. Delete a comment without replies. Body masked.
6. Sign out, verify list visible and form replaced by sign-in button.
7. As a second user: edit/delete buttons absent on user A's comments. Forced API call returns FORBIDDEN.
8. As admin: delete user A's comment succeeds.
9. 1001 chars: counter blocks. Forced API returns Zod message.
10. Switch a post to `archived` (via SQL). Existing comments still editable; new comment creation rejects.
11. Hard-delete a post via SQL. `post_comments` rows for it disappear (cascade).
