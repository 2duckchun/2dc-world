import { redirect } from "next/navigation"
import { getAuthSession, getViewerSessionFromSession } from "@/core/auth"

export async function requireOwnerSession() {
  const session = await getAuthSession()
  const viewerSession = getViewerSessionFromSession(session)

  if (!viewerSession.isOwner) {
    redirect("/")
  }

  return viewerSession
}
