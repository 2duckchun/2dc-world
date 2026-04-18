import type { DefaultSession } from "next-auth"
import type { ViewerRole } from "@/core/auth"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      githubAccountId: string | null
      role: ViewerRole
    }
  }

  interface User {
    githubAccountId?: string | null
    role?: ViewerRole
  }
}
