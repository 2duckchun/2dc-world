import { cn } from "@/shared/lib/utils"
import type { HomeContentTab } from "@/views/home/sections/home-content-explorer-section/components/home-content-explorer"

export type HomeContentTabItem = {
  value: HomeContentTab
  label: string
  count: number
}

type HomeContentTabsProps = {
  tabs: readonly HomeContentTabItem[]
  activeTab: HomeContentTab
  onTabChange: (tab: HomeContentTab) => void
}

export function HomeContentTabs({
  tabs,
  activeTab,
  onTabChange,
}: HomeContentTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="홈 콘텐츠 유형"
      className="flex flex-wrap items-end gap-1 border-foreground border-b-2"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value

        return (
          <button
            key={tab.value}
            id={`home-content-tab-${tab.value}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`home-content-panel-${tab.value}`}
            // 폴더 탭: 선택된 탭은 아래 선을 2px 덮어 본문과 이어진 것처럼 보이게 한다.
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 border-2 border-foreground border-b-0 px-2 pt-1 uppercase sm:px-3",
              isActive
                ? "-mb-0.5 bg-background pb-1.5 text-foreground"
                : "bg-muted pb-1 text-muted-foreground hover:text-foreground",
            )}
            onClick={() => onTabChange(tab.value)}
          >
            <span>{tab.label}</span>
            <span className={cn("tabular-nums", isActive && "text-point")}>
              {tab.count.toLocaleString("ko-KR")}
            </span>
          </button>
        )
      })}
    </div>
  )
}
