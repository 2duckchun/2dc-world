import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import NextAuth from "next-auth"
import GitHub, { type GitHubProfile } from "next-auth/providers/github"
import { getGithubRole } from "@/core/auth/roles"
import { db } from "@/core/db"
import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "@/core/db/schema"

const authTables = {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
  authenticatorsTable: authenticators,
}

const getProfileUser = (profile: GitHubProfile) => {
  const githubId = profile.id.toString()
  const githubUsername = profile.login

  return {
    id: githubId,
    name: profile.name ?? githubUsername,
    email: profile.email,
    image: profile.avatar_url,
    role: getGithubRole(githubUsername, githubId),
    githubId,
    githubUsername,
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, authTables),
  session: {
    strategy: "database",
  },
  providers: [
    GitHub({
      profile: getProfileUser,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      session.user.role = user.role
      session.user.githubId = user.githubId
      session.user.githubUsername = user.githubUsername

      return session
    },
  },
  events: {
    async signIn({ account, profile, user }) {
      if (account?.provider !== "github" || !profile || !user.id) {
        return
      }

      const githubProfile = profile as unknown as GitHubProfile
      const githubId = githubProfile.id.toString()
      const githubUsername = githubProfile.login

      await db
        .update(users)
        .set({
          role: getGithubRole(githubUsername, githubId),
          githubId,
          githubUsername,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))
    },
  },
})
