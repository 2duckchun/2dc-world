import "server-only"

export const userRoles = ["user", "admin"] as const

export type UserRole = (typeof userRoles)[number]

const normalizeGithubIdentifier = (identifier: string) =>
  identifier.trim().toLowerCase()

const getAdminGithubIdentifiers = () =>
  new Set(
    [process.env.AUTH_ADMIN_GITHUB_IDS, process.env.OWNER_GITHUB_ID]
      .filter(Boolean)
      .join(",")
      .split(",")
      .map(normalizeGithubIdentifier)
      .filter(Boolean),
  )

export const getGithubRole = (
  githubUsername: string | null | undefined,
  githubId: string | number | null | undefined,
): UserRole => {
  const adminGithubIdentifiers = getAdminGithubIdentifiers()
  const identifiers = [githubUsername, githubId?.toString()]
    .filter((identifier): identifier is string => Boolean(identifier))
    .map(normalizeGithubIdentifier)

  return identifiers.some((identifier) =>
    adminGithubIdentifiers.has(identifier),
  )
    ? "admin"
    : "user"
}
