import { cn } from "@/shared/lib/utils"
import {
  getLayoutContainerClassName,
  type LayoutWidth,
  layoutPanelClassName,
} from "@/widgets/layouts/layout-styles"

type MainContentProps = {
  children: React.ReactNode
  width?: LayoutWidth
}

// 필드 맵 위에 놓인 종이색 본문 창. 본문 글자는 항상 이 창 안에 놓여 대비를 보장한다.
export const MainContent = ({
  children,
  width = "reading",
}: MainContentProps) => {
  return (
    <main className={cn(getLayoutContainerClassName(width), "flex-1")}>
      <div className={cn(layoutPanelClassName, "px-4 py-8 sm:px-8 sm:py-10")}>
        {children}
      </div>
    </main>
  )
}
