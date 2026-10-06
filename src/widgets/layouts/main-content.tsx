import { cn } from "@/shared/lib/utils"
import {
  getLayoutContainerClassName,
  type LayoutWidth,
} from "@/widgets/layouts/layout-styles"

type MainContentProps = {
  children: React.ReactNode
  width?: LayoutWidth
}

// 데스크톱 위에 놓인 종이색 창 하나. 본문 글자는 항상 이 창 안에 놓여 대비를 보장한다.
export const MainContent = ({
  children,
  width = "reading",
}: MainContentProps) => {
  return (
    <main className={cn(getLayoutContainerClassName(width), "flex-1")}>
      <div className="border-2 border-foreground bg-background px-4 py-8 shadow-pixel sm:px-8 sm:py-10">
        {children}
      </div>
    </main>
  )
}
