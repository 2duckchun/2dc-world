import "server-only"

import { auth } from "@/auth"
import { db } from "@/core/db"

export const createTRPCContext = async (opts?: { req?: Request }) => {
  const session = await auth()

  return {
    db,
    req: opts?.req,
    session,
  }
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>
