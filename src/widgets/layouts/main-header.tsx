import { Home, LogIn, LogOut, ShieldCheck, User } from "lucide-react"
import { auth } from "@/auth"
import { signInWithGitHub, signOutCurrentUser } from "@/core/auth/actions"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"
import { ThemeToggle } from "@/shared/ui/theme-toggle"

export const MainHeader = async () => {
  const session = await auth()

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
          {session?.user ? (
            <>
              <span
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "border border-border bg-background/75 shadow-sm backdrop-blur",
                )}
              >
                {session.user.role === "admin" ? (
                  <ShieldCheck data-icon="inline-start" className="size-4" />
                ) : (
                  <User data-icon="inline-start" className="size-4" />
                )}
                <span className="max-w-28 truncate sm:max-w-40">
                  {session.user.githubUsername
                    ? `@${session.user.githubUsername}`
                    : session.user.role}
                </span>
              </span>
              <form action={signOutCurrentUser}>
                <button
                  type="submit"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "border border-border bg-background/75 shadow-sm backdrop-blur hover:bg-muted/80",
                  )}
                  aria-label="로그아웃"
                  title="로그아웃"
                >
                  <LogOut className="size-4" />
                </button>
              </form>
            </>
          ) : (
            <form action={signInWithGitHub}>
              <button
                type="submit"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "border border-border bg-background/75 shadow-sm backdrop-blur hover:bg-muted/80",
                )}
              >
                <LogIn data-icon="inline-start" className="size-4" />
                login
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  )
}
