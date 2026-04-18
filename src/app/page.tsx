import { getServerCaller } from "@/core/trpc/server"
import { HomeView } from "@/views/home"

export default async function HomePage() {
  const caller = await getServerCaller()
  const [session, capabilities] = await Promise.all([
    caller.viewer.getSession(),
    caller.viewer.getCapabilities(),
  ])

  return <HomeView session={session} capabilities={capabilities} />
}
