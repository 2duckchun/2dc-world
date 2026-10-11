"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

// 이전 커스텀 토글이 쓰던 키를 그대로 써서 기존 방문자의 테마 설정을 유지한다.
const themeStorageKey = "2dc-world-theme"

type ThemeProviderProps = {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      storageKey={themeStorageKey}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
