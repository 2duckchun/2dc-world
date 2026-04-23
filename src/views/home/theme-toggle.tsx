"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/shared/ui/button"

type Theme = "light" | "dark"

const themeStorageKey = "2dc-world-theme"

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(themeStorageKey)
    const nextTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : getSystemTheme()

    setTheme(nextTheme)
    applyTheme(nextTheme)
  }, [])

  const isDark = theme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      aria-pressed={isDark}
      className="relative border border-border bg-background/75 shadow-sm backdrop-blur hover:bg-muted/80"
      onClick={() => {
        const nextTheme = isDark ? "light" : "dark"
        setTheme(nextTheme)
        applyTheme(nextTheme)
        window.localStorage.setItem(themeStorageKey, nextTheme)
      }}
    >
      <Sun className="scale-100 rotate-0 opacity-100 transition-all dark:scale-75 dark:-rotate-45 dark:opacity-0" />
      <Moon className="absolute scale-75 rotate-45 opacity-0 transition-all dark:scale-100 dark:rotate-0 dark:opacity-100" />
    </Button>
  )
}
