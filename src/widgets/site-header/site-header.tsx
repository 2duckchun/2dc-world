import Link from "next/link"
import type { ViewerSession } from "@/core/auth"
import { AuthStatusControls } from "@/widgets/auth/auth-status-controls"
import { SiteNav } from "@/widgets/site-header/site-nav"
import { ThemeToggle } from "@/widgets/theme/theme-toggle"

type SiteHeaderProps = {
  session: ViewerSession
}

export function SiteHeader({ session }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between xl:flex-1">
            <div className="space-y-1">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
              >
                <span className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                  2DC
                </span>
                <span>2dc world</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                A reading-first space for essays, memos, and booklogs.
              </p>
            </div>
            <SiteNav />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:justify-end">
            <ThemeToggle />
            <AuthStatusControls session={session} />
          </div>
        </div>
      </div>
    </header>
  )
}
