import type { CSSProperties } from "react"

export function animationDelay(value: number): CSSProperties {
  return { "--delay": `${value}ms` } as CSSProperties
}
