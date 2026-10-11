import { cn } from "@/shared/lib/utils"
import { AppRoutes } from "@/shared/utils/app-routes"
import { SITE_NAME } from "@/shared/utils/metadata"
import {
  getLayoutContainerClassName,
  type LayoutWidth,
  layoutLinkClassName,
  layoutPanelClassName,
} from "@/widgets/layouts/layout-styles"

type MainFooterProps = {
  width?: LayoutWidth
}

export const MainFooter = ({ width = "reading" }: MainFooterProps) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={getLayoutContainerClassName(width)}>
      <div
        className={cn(
          layoutPanelClassName,
          "flex flex-col items-center justify-between gap-1 px-4 py-2 text-muted-foreground sm:flex-row",
        )}
      >
        <p>
          © {currentYear} {SITE_NAME}
        </p>
        <nav aria-label="하단 메뉴" className="flex items-center gap-4">
          <a href={AppRoutes.privacy()} className={layoutLinkClassName}>
            개인정보 처리방침
          </a>
          <a href={AppRoutes.rss()} className={layoutLinkClassName}>
            RSS
          </a>
        </nav>
      </div>
    </footer>
  )
}
