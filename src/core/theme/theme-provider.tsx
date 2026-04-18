"use client"

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { THEME_STORAGE_KEY, type Theme } from "./constants"

type ThemeContextValue = {
  theme: Theme
  setTheme: (nextTheme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light"
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function applyTheme(nextTheme: Theme) {
  const root = document.documentElement

  root.dataset.theme = nextTheme
  root.classList.toggle("dark", nextTheme === "dark")
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>("light")

  const setTheme = useCallback((nextTheme: Theme) => {
    applyTheme(nextTheme)
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    setThemeState(nextTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [setTheme, theme])

  useEffect(() => {
    const nextTheme = getPreferredTheme()
    applyTheme(nextTheme)
    setThemeState(nextTheme)
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}
