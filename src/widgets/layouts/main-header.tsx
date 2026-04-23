import { Home, LogIn } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"
import { ThemeToggle } from "@/shared/ui/theme-toggle"

export const MainHeader = () => {
  return (
    <header className="sticky top-0 z-20 border-border/70 border-b bg-background/78 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-semibold"
        >
          <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-card shadow-sm transition-transform group-hover:-translate-y-0.5">
            <Home className="size-4" />
          </span>
          home
        </a>

        <nav className="flex items-center gap-2" aria-label="상단 메뉴">
          <ThemeToggle />
          <a
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "border border-border bg-background/75 shadow-sm backdrop-blur hover:bg-muted/80",
            )}
          >
            <LogIn data-icon="inline-start" className="size-4" />
            login
          </a>
        </nav>
      </div>
    </header>
  )
}
