"use client"

import { MoonStarIcon, SunIcon } from "lucide-react"
import { useTheme } from "@/core/theme/theme-provider"
import { Button } from "@/shared/ui/button"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <SunIcon /> : <MoonStarIcon />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </Button>
  )
}
