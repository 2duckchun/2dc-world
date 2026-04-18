import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { and, eq } from "drizzle-orm"
import type { DefaultSession } from "next-auth"
import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { db } from "@/core/db"
import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "@/core/db/schema/auth"
import { getServerEnv } from "@/core/env/server"

export const viewerRoles = ["anonymous", "authenticated", "owner"] as const

export type ViewerRole = (typeof viewerRoles)[number]

export type ViewerUser = DefaultSession["user"] & {
  id: string
  name: string | null
  email: string | null
  image: string | null
  githubAccountId: string | null
}

export type ViewerSession = {
  role: ViewerRole
  isAuthenticated: boolean
  isOwner: boolean
  user: ViewerUser | null
}

export type ViewerCapabilities = {
  role: ViewerRole
  canInteract: boolean
  canLike: boolean
  canComment: boolean
  canReply: boolean
  canWrite: boolean
  canEdit: boolean
  canPublish: boolean
  canDeleteComment: boolean
}

async function getGitHubAccountIdForUser(userId: string) {
  const account = await db.query.accounts.findFirst({
    where: and(eq(accounts.userId, userId), eq(accounts.provider, "github")),
  })

  return account?.providerAccountId ?? null
}

export function getViewerCapabilities(role: ViewerRole): ViewerCapabilities {
  const canInteract = role !== "anonymous"
  const canOwnContent = role === "owner"

  return {
    role,
    canInteract,
    canLike: canInteract,
    canComment: canInteract,
    canReply: canInteract,
    canWrite: canOwnContent,
    canEdit: canOwnContent,
    canPublish: canOwnContent,
    canDeleteComment: canOwnContent,
  }
}

export function getViewerSessionFromSession(
  session: Awaited<ReturnType<typeof getAuthSession>>,
): ViewerSession {
  if (!session?.user) {
    return {
      role: "anonymous",
      isAuthenticated: false,
      isOwner: false,
      user: null,
    }
  }

  const role = session.user.role

  return {
    role,
    isAuthenticated: true,
    isOwner: role === "owner",
    user: {
      id: session.user.id,
      name: session.user.name ?? null,
      email: session.user.email ?? null,
      image: session.user.image ?? null,
      githubAccountId: session.user.githubAccountId,
    },
  }
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  secret: getServerEnv().AUTH_SECRET,
  session: {
    strategy: "database",
  },
  providers: [
    GitHubProvider({
      clientId: getServerEnv().AUTH_GITHUB_ID,
      clientSecret: getServerEnv().AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const githubAccountId = await getGitHubAccountIdForUser(user.id)
      const role: ViewerRole =
        githubAccountId === getServerEnv().OWNER_GITHUB_ID
          ? "owner"
          : "authenticated"

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
          githubAccountId,
          role,
        },
      }
    },
  },
}

export function getAuthSession() {
  return getServerSession(authOptions)
}

export const authHandler = NextAuth(authOptions)
