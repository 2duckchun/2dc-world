import { cn } from "@/shared/lib/utils"
import type { HomeContentTab } from "@/views/home/sections/home-content-explorer-section/components/home-content-types"

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
      className="grid grid-cols-2 bg-card sm:grid-cols-4"
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
            className={cn(
              "flex min-h-16 cursor-pointer items-center justify-center gap-2 border-border border-t px-3 font-bold text-base transition-colors first:border-t-0 odd:border-r sm:border-t-0 sm:border-r sm:first:border-l-0 sm:last:border-r-0",
              isActive
                ? "bg-background text-foreground"
                : "bg-card text-muted-foreground hover:bg-muted/55 hover:text-foreground",
            )}
            onClick={() => onTabChange(tab.value)}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 font-mono text-xs tabular-nums",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {tab.count.toLocaleString("ko-KR")}
            </span>
          </button>
        )
      })}
    </div>
  )
}
