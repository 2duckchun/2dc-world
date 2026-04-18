import type { PropsWithChildren } from "react"
import type { ViewerSession } from "@/core/auth"
import { SiteHeader } from "@/widgets/site-header/site-header"

type AppShellProps = PropsWithChildren<{
  session: ViewerSession
}>

export function AppShell({ children, session }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader session={session} />
      <main className="flex flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
