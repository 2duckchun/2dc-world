import { cache } from "react"
import {
  getAuthSession,
  getViewerCapabilities,
  getViewerSessionFromSession,
} from "@/core/auth"

async function buildTRPCContext() {
  const session = getViewerSessionFromSession(await getAuthSession())

  return {
    session,
    capabilities: getViewerCapabilities(session.role),
  }
}

export const createTRPCContext = cache(buildTRPCContext)
