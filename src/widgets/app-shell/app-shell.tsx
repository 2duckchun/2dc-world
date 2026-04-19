import Link from "next/link"
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
      <footer className="border-t border-border/70 bg-background/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>
            Phase 1 is focused on calm, public reading without sign-in friction.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/blog"
              className="transition-colors hover:text-foreground"
            >
              Blog
            </Link>
            <Link
              href="/memo"
              className="transition-colors hover:text-foreground"
            >
              Memo
            </Link>
            <Link
              href="/booklog"
              className="transition-colors hover:text-foreground"
            >
              Booklog
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
