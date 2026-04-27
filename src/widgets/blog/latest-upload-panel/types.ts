import type { CSSProperties } from "react"

export type LatestUploadItem = {
  title: string
  href: string
  category: string
  summary: string
  meta: string
}

export type LatestUploadPanelProps = {
  eyebrow: string
  title: string
  titleId: string
  spotlight: LatestUploadItem | null
  posts: readonly LatestUploadItem[]
  className?: string
  style?: CSSProperties
}
