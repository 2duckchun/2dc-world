"use client"

import { useTheme } from "next-themes"
import { Button } from "@/shared/ui/button"
import { PixelIcon } from "@/shared/ui/pixel-icon"

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()

  // resolvedTheme은 서버 렌더링 시점에 알 수 없으므로 아이콘 전환은 dark: variant로 처리하고,
  // 라벨도 테마와 무관한 문구로 고정해 hydration 불일치를 피한다.
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="라이트/다크 모드 전환"
      title="라이트/다크 모드 전환"
      className={className}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <PixelIcon name="sun" className="dark:hidden" />
      <PixelIcon name="moon" className="hidden dark:block" />
    </Button>
  )
}
