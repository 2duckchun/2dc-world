import type { PostKind } from "@/domain/content/types"

export type HomeContentTab = "all" | PostKind

export type HomeContentTag = {
  id: string
  name: string
  slug: string
}

export type HomeContentPost = {
  id: string
  title: string
  href: string
  kind: PostKind
  subtitle: string | null
  publishedAt: string | null
  createdAt: string
  tags: readonly HomeContentTag[]
}

export type HomeContentSeries = {
  id: string
  title: string
  href: string
  description: string | null
  thumbnail: string | null
  episodeCount: number
  latestAt: string
}
