export const THEME_STORAGE_KEY = "2dc-world-theme"

export const themes = ["light", "dark"] as const

export type Theme = (typeof themes)[number]
