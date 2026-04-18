import Link from "next/link"
import type { ViewerSession } from "@/core/auth"
import { primaryNavigationItems } from "@/shared/config/navigation"
import { cn } from "@/shared/lib/utils"
import { AuthStatusControls } from "@/widgets/auth/auth-status-controls"
import { ThemeToggle } from "@/widgets/theme/theme-toggle"

type SiteHeaderProps = {
  session: ViewerSession
}

export function SiteHeader({ session }: SiteHeaderProps) {
  return (
    <header className="border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
            >
              <span className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                2DC
              </span>
              <span>2dc world</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Phase 0 foundation for blog, memo, and booklog experiences.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
            <ThemeToggle />
            <AuthStatusControls session={session} />
          </div>
        </div>

        <nav aria-label="Primary" className="flex flex-wrap gap-2">
          {primaryNavigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full border border-border px-3 py-2 text-sm font-medium transition-colors",
                "hover:border-primary/50 hover:text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
