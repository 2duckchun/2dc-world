import type { DefaultSession } from "next-auth"
import type { UserRole } from "@/core/auth/roles"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      githubId?: string | null
      githubUsername?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
    githubId?: string | null
    githubUsername?: string | null
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: UserRole
    githubId?: string | null
    githubUsername?: string | null
  }
}
