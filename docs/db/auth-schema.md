# Auth Database Schema

## Purpose

This document records the account and OAuth persistence design. The canonical
schema lives in `src/core/db/schema.ts`; runtime wiring lives in `src/auth.ts`.

Authentication uses Auth.js through `next-auth` with the Drizzle adapter and the
GitHub OAuth provider. Sessions use the database strategy, so the session cookie
points at a row in `sessions` instead of carrying all user state in a JWT.

## Runtime Contract

Auth setup:

- `src/auth.ts` exports `handlers`, `auth`, `signIn`, and `signOut`.
- `src/app/api/auth/[...nextauth]/route.ts` re-exports Auth.js `GET` and `POST`
  handlers.
- The GitHub provider profile callback maps GitHub profile data into the local
  `users` row shape.
- The session callback exposes `id`, `role`, `githubId`, and `githubUsername` on
  `session.user`.
- The sign-in event refreshes GitHub identity and role fields on every GitHub
  login.

Environment variables:

| Variable | Purpose |
| --- | --- |
| `AUTH_SECRET` | Auth.js secret for signing/encryption. |
| `AUTH_GITHUB_ID` | GitHub OAuth app client id. |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret. |
| `AUTH_ADMIN_GITHUB_IDS` | Comma-separated GitHub usernames or numeric ids that should become admins. |
| `OWNER_GITHUB_ID` | Backward-compatible single owner id also accepted by role resolution. |

GitHub callback URL for local development:

```text
http://localhost:3000/api/auth/callback/github
```

## Roles

`user_role` is an enum with these values:

| Value | Meaning |
| --- | --- |
| `user` | Default signed-in user. |
| `admin` | User allowed to access admin-only write flows. |

Role assignment happens in application code, not through a separate role table.
`src/core/auth/roles.ts` normalizes configured GitHub identifiers by trimming and
lowercasing them, then compares both GitHub username and numeric id.

Authorization checks should use `session.user.role`. The database stores the
role on `users` so server components, server actions, and future domain
procedures can share the same source of truth.

## Users

`users` is the Auth.js user table plus application-specific GitHub and role
columns.

| Column | Null | Purpose |
| --- | --- | --- |
| `id` | no | Primary key. For GitHub-created users this is the GitHub numeric id as text. |
| `name` | yes | Display name from GitHub, falling back to username. |
| `email` | yes | Email supplied by GitHub/Auth.js. Unique when present. |
| `email_verified` | yes | Auth.js-compatible email verification timestamp. |
| `image` | yes | GitHub avatar URL. |
| `role` | no | `user_role`; defaults to `user`. |
| `github_id` | yes | GitHub numeric account id as text. Unique when present. |
| `github_username` | yes | GitHub login name. Unique when present. |
| `created_at` | no | Creation timestamp. |
| `updated_at` | no | Last update timestamp. |

Notes:

- `id` is generated with `crypto.randomUUID()` by default, but the GitHub profile
  callback currently provides the GitHub id as the user id.
- `github_id` is still stored explicitly so GitHub identity can be queried
  without assuming every future auth provider uses the same id strategy.
- `updated_at` is refreshed during GitHub sign-in when identity and role fields
  are synchronized.

## Accounts

`accounts` links provider accounts to local users. This table is owned by the
Auth.js adapter contract.

| Column | Null | Purpose |
| --- | --- | --- |
| `user_id` | no | References `users.id`. |
| `type` | no | Auth.js account type, such as `oauth`. |
| `provider` | no | Provider id, currently `github`. |
| `provider_account_id` | no | Provider-specific account id. |
| `refresh_token` | yes | OAuth refresh token if supplied. |
| `access_token` | yes | OAuth access token if supplied. |
| `expires_at` | yes | OAuth token expiry epoch seconds. |
| `token_type` | yes | OAuth token type. |
| `scope` | yes | OAuth scopes granted. |
| `id_token` | yes | OIDC id token if supplied. |
| `session_state` | yes | Provider-specific session state. |

Constraints:

- Primary key is `(provider, provider_account_id)`.
- `user_id` references `users.id` with `on delete cascade`.

## Sessions

`sessions` stores database-backed Auth.js sessions.

| Column | Null | Purpose |
| --- | --- | --- |
| `session_token` | no | Primary key token stored in the user's session cookie. |
| `user_id` | no | References `users.id`. |
| `expires` | no | Session expiry timestamp. |

Constraints:

- `user_id` references `users.id` with `on delete cascade`.

Because the app uses database sessions, role changes in `users.role` can be
reflected on future session reads without requiring a user to reauthenticate.

## Verification Tokens

`verification_tokens` is included for Auth.js adapter compatibility and future
magic-link support.

| Column | Null | Purpose |
| --- | --- | --- |
| `identifier` | no | Email or provider-specific identifier. |
| `token` | no | Verification token. |
| `expires` | no | Token expiry timestamp. |

Constraints:

- Primary key is `(identifier, token)`.

The current GitHub OAuth flow does not use this table directly.

## Authenticators

`authenticators` is included for Auth.js WebAuthn/passkey adapter compatibility.

| Column | Null | Purpose |
| --- | --- | --- |
| `credential_id` | no | WebAuthn credential id. Unique. |
| `user_id` | no | References `users.id`. |
| `provider_account_id` | no | Provider account id associated with the credential. |
| `credential_public_key` | no | WebAuthn public key. |
| `counter` | no | WebAuthn signature counter. |
| `credential_device_type` | no | Device type metadata. |
| `credential_backed_up` | no | Whether the credential is backed up. |
| `transports` | yes | Transport hints. |

Constraints:

- Primary key is `(user_id, credential_id)`.
- `credential_id` is unique.
- `user_id` references `users.id` with `on delete cascade`.

The current GitHub OAuth flow does not use this table directly.

## Deletion Policy

Deleting a user cascades Auth.js-owned account/session/token/authenticator rows.
Content rows use separate policies documented in `docs/db/content-schema.md`.
In particular, posts reference `users.id` with `on delete restrict` so authored
posts are not orphaned by accidental user deletion.

## Migration History

The Auth schema was introduced in:

```text
drizzle/0000_late_genesis.sql
```

Subsequent content migrations may depend on `users.id` and `user_role`, so auth
schema changes should be treated as foundational.

## Future Extensions

Likely future additions:

- A dedicated role audit log if admin promotion changes need history.
- A provider-agnostic `identities` table if OAuth providers beyond GitHub become
  first-class.
- Account linking UI and policy if multiple OAuth providers are supported.
- Explicit session revocation UI backed by deleting `sessions` rows.
