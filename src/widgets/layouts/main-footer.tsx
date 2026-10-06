import { cn } from "@/shared/lib/utils"
import { AppRoutes } from "@/shared/utils/app-routes"
import { SITE_NAME } from "@/shared/utils/metadata"
import {
  desktopLinkClassName,
  getLayoutContainerClassName,
  type LayoutWidth,
} from "@/widgets/layouts/layout-styles"

type MainFooterProps = {
  width?: LayoutWidth
}

export const MainFooter = ({ width = "reading" }: MainFooterProps) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer>
      <div
        className={cn(
          getLayoutContainerClassName(width),
          "flex flex-col items-center justify-between gap-2 py-8 text-muted-foreground sm:flex-row",
        )}
      >
        <p>
          © {currentYear} {SITE_NAME}
        </p>
        <nav aria-label="하단 메뉴" className="flex items-center gap-4">
          <a href={AppRoutes.privacy()} className={desktopLinkClassName}>
            개인정보 처리방침
          </a>
          <a href={AppRoutes.rss()} className={desktopLinkClassName}>
            RSS
          </a>
        </nav>
      </div>
    </footer>
  )
}
