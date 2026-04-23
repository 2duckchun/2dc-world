# Content Database Schema

## Purpose

This document records the current database design for account-backed markdown
content. The canonical implementation is `src/core/db/schema.ts`, and schema
changes are applied through Drizzle migrations in `drizzle/`.

The content model has three product rules:

- GitHub OAuth users can sign in through Auth.js.
- Only users with `admin` role may create or edit posts at the application
  layer.
- A post may belong to zero or one series, never multiple series.

## Account Tables

Auth.js owns the login/session persistence shape:

- `users`
- `accounts`
- `sessions`
- `verification_tokens`
- `authenticators`

`users` also carries application-specific identity and authorization fields:

| Column | Purpose |
| --- | --- |
| `role` | Application role. Current values: `user`, `admin`. |
| `github_id` | GitHub numeric account id as text. |
| `github_username` | GitHub login name. |

Admin assignment is derived from configured GitHub usernames or numeric ids.
Authorization checks should use the session role, not ad hoc GitHub profile
lookups.

## Post Status

`post_status` is an enum with these values:

| Value | Meaning |
| --- | --- |
| `draft` | Saved but not publicly listed. |
| `published` | Publicly visible. |
| `archived` | Hidden from normal publishing flows without deleting history. |

## Posts

`posts` stores the markdown source for each article.

| Column | Null | Purpose |
| --- | --- | --- |
| `id` | no | Primary key. Generated with `crypto.randomUUID()`. |
| `title` | no | Main display title. |
| `slug` | no | Unique URL identifier. |
| `subtitle` | yes | Optional short supporting title. |
| `thumbnail` | yes | Optional thumbnail URL/path. |
| `content` | no | Markdown source. |
| `status` | no | Publication state. Defaults to `draft`. |
| `author_id` | no | Authoring user. References `users.id`. |
| `series_id` | yes | Optional parent series. References `series.id`. |
| `series_order` | yes | Position inside a series. |
| `published_at` | yes | First or current publication timestamp. |
| `created_at` | no | Creation timestamp. |
| `updated_at` | no | Last update timestamp. |

Constraints:

- `slug` is unique.
- `author_id` uses `on delete restrict` to preserve authorship history.
- `series_id` uses `on delete set null`; deleting a series keeps posts as
  standalone posts.
- `(series_id, series_order)` is unique so the same series cannot have two posts
  at the same position.
- `posts_series_order_pair_check` requires `series_id` and `series_order` to be
  both null or both non-null.

## Series

`series` groups posts into ordered reading sequences.

| Column | Null | Purpose |
| --- | --- | --- |
| `id` | no | Primary key. Generated with `crypto.randomUUID()`. |
| `title` | no | Display title. |
| `slug` | no | Unique URL identifier. |
| `description` | yes | Optional series summary. |
| `thumbnail` | yes | Optional thumbnail URL/path. |
| `created_at` | no | Creation timestamp. |
| `updated_at` | no | Last update timestamp. |

One post belongs to at most one series through `posts.series_id`.

## Tags

Tags are many-to-many because a post can carry multiple topical labels, and a
tag can apply to many posts.

`tags`:

| Column | Null | Purpose |
| --- | --- | --- |
| `id` | no | Primary key. Generated with `crypto.randomUUID()`. |
| `name` | no | Display label. |
| `slug` | no | Unique URL identifier. |
| `created_at` | no | Creation timestamp. |

`post_tags`:

| Column | Null | Purpose |
| --- | --- | --- |
| `post_id` | no | References `posts.id`. |
| `tag_id` | no | References `tags.id`. |

Constraints:

- `(post_id, tag_id)` is the primary key.
- Both foreign keys use `on delete cascade`, so deleting a post or tag clears
  only the join rows.

## Markdown Storage

`posts.content` stores markdown source, not rendered HTML. Rendering, sanitizing,
and any generated metadata should happen in application/domain code unless a
future performance requirement justifies persisted render artifacts.

If rendered output is persisted later, prefer adding explicit fields such as
`content_html` or a separate render cache table rather than replacing
`content`.

## Future Extensions

Likely future additions:

- `excerpt` or `description` on `posts` if previews should differ from
  `subtitle`.
- `reading_time_minutes` as derived metadata.
- `cover_asset_id` if thumbnails move from URL/path strings into an asset table.
- `created_by` and `updated_by` audit columns if multiple admins edit the same
  post.
- `deleted_at` if soft deletion becomes necessary.

Avoid moving tags into an array column unless tag pages and tag management are
explicitly out of scope. The current join-table shape keeps tag rename, lookup,
and listing behavior straightforward.
