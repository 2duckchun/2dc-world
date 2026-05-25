import { AppRoutes } from "@/shared/utils/app-routes"
import { SITE_NAME } from "@/shared/utils/metadata"

export const MainFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-border/70 border-t bg-background/78">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-muted-foreground text-sm sm:flex-row sm:px-8">
        <p>
          © {currentYear} {SITE_NAME}
        </p>
        <nav aria-label="하단 메뉴" className="flex items-center gap-4">
          <a
            href={AppRoutes.privacy()}
            className="transition-colors hover:text-foreground"
          >
            개인정보 처리방침
          </a>
          <a
            href={AppRoutes.rss()}
            className="transition-colors hover:text-foreground"
          >
            RSS
          </a>
        </nav>
      </div>
    </footer>
  )
}
