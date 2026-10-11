import { DesktopMap } from "@/widgets/layouts/desktop-map"
import type { LayoutWidth } from "@/widgets/layouts/layout-styles"
import { MainContent } from "@/widgets/layouts/main-content"
import { MainFooter } from "@/widgets/layouts/main-footer"
import { MainHeader } from "@/widgets/layouts/main-header"

type SiteLayoutProps = {
  children: React.ReactNode
  width?: LayoutWidth
}

export const SiteLayout = ({
  children,
  width = "reading",
}: SiteLayoutProps) => {
  return (
    <div className="flex min-h-svh flex-col gap-4 py-4 sm:gap-6 sm:py-6">
      <DesktopMap />
      <MainHeader width={width} />
      <MainContent width={width}>{children}</MainContent>
      <MainFooter width={width} />
    </div>
  )
}
