import { auth } from "@/auth"
import { signInWithGitHub, signOutCurrentUser } from "@/core/auth/actions"
import { ThemeToggle } from "@/shared/ui/theme-toggle"
import { AppRoutes } from "@/shared/utils/app-routes"
import {
  getLayoutContainerClassName,
  type LayoutWidth,
  layoutLinkClassName,
  layoutPanelClassName,
} from "@/widgets/layouts/layout-styles"
import { MainNav } from "@/widgets/layouts/main-nav"

const adminLinks = [
  { label: "글 관리", href: AppRoutes.admin.posts.list() },
  { label: "시리즈 관리", href: AppRoutes.admin.series.list() },
  { label: "새 글", href: AppRoutes.admin.posts.new() },
] as const

type MainHeaderProps = {
  width?: LayoutWidth
}

export const MainHeader = async ({ width = "reading" }: MainHeaderProps) => {
  const session = await auth()
  const user = session?.user

  return (
    <header className={getLayoutContainerClassName(width)}>
      <div className={layoutPanelClassName}>
        {user?.role === "admin" ? (
          <nav
            aria-label="관리자 메뉴"
            className="flex flex-wrap items-center gap-x-4 bg-foreground px-4 text-background"
          >
            <span>ADMIN</span>
            {adminLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={layoutLinkClassName}
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : null}

        <div className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 px-4 py-2 sm:grid-cols-[auto_1fr_auto]">
          <a href={AppRoutes.home()} className="justify-self-start">
            <span className="bg-foreground px-1 text-background">2DC</span> Tech
            Blog
          </a>

          <MainNav className="col-span-2 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1" />

          <div className="flex items-center gap-3 justify-self-end">
            <ThemeToggle />
            {user ? (
              <>
                <span className="max-w-32 truncate text-muted-foreground sm:max-w-40">
                  {user.githubUsername ? `@${user.githubUsername}` : user.role}
                </span>
                <form action={signOutCurrentUser}>
                  <button type="submit" className={layoutLinkClassName}>
                    LOGOUT
                  </button>
                </form>
              </>
            ) : (
              <form action={signInWithGitHub}>
                <button
                  type="submit"
                  title="GitHub 계정으로 로그인"
                  className={layoutLinkClassName}
                >
                  LOGIN
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
