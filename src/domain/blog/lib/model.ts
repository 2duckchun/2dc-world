export const readingCollections = ["blog", "memo", "booklog"] as const
export type ReadingCollection = (typeof readingCollections)[number]

export const postTypes = ["BLOG", "MEMO", "BOOKLOG"] as const
export const postStatuses = ["DRAFT", "PUBLISHED"] as const

export type PostType = (typeof postTypes)[number]
export type PostStatus = (typeof postStatuses)[number]

export type PublishedTag = {
  id: string
  name: string
}

export type PublishedSeriesLink = {
  slug: string
  title: string
  coverImageUrl: string | null
  href: string
  orderIndex: number | null
  chapterLabel: string | null
}

export type PublishedPostSummary = {
  id: string
  type: PostType
  slug: string
  title: string
  summary: string | null
  href: string
  publishedAt: string | null
  updatedAt: string
  tags: PublishedTag[]
  series: PublishedSeriesLink | null
}

export type PublishedPostDetail = PublishedPostSummary & {
  contentMarkdown: string
}

export type PublishedSeriesSummary = {
  id: string
  slug: string
  title: string
  description: string | null
  coverImageUrl: string | null
  href: string
  postCount: number
  updatedAt: string
}

export type PublishedSeriesDetail = PublishedSeriesSummary & {
  items: PublishedPostSummary[]
}

export type TagResults = {
  tagName: string
  items: PublishedPostSummary[]
}

export type EditableSeriesSelection = {
  seriesId: string
  title: string
  slug: string
  coverImageUrl: string | null
  orderIndex: number
  chapterLabel: string | null
}

export type EditablePost = {
  id: string
  type: PostType
  status: PostStatus
  title: string
  slug: string
  summary: string | null
  contentMarkdown: string
  publishedAt: string | null
  updatedAt: string
  tagNames: string[]
  series: EditableSeriesSelection | null
}

export type DraftListItem = {
  id: string
  type: PostType
  status: PostStatus
  title: string
  slug: string
  summary: string | null
  updatedAt: string
  publishedAt: string | null
}

export type AuthoringSeries = {
  id: string
  slug: string
  title: string
  description: string | null
  coverImageUrl: string | null
  createdAt: string
  updatedAt: string
}

export type SyncTagsResult = {
  postId: string
  tagNames: string[]
}

export function postTypeToCollection(type: PostType): ReadingCollection {
  switch (type) {
    case "BLOG":
      return "blog"
    case "MEMO":
      return "memo"
    case "BOOKLOG":
      return "booklog"
  }
}

export function collectionToPostType(collection: ReadingCollection): PostType {
  switch (collection) {
    case "blog":
      return "BLOG"
    case "memo":
      return "MEMO"
    case "booklog":
      return "BOOKLOG"
  }
}

export function buildPostHref(type: PostType, slug: string) {
  return `/${postTypeToCollection(type)}/${slug}`
}

export function buildSeriesHref(slug: string) {
  return `/booklog/series/${slug}`
}

export function buildTagHref(name: string) {
  return `/tags/${encodeURIComponent(name)}`
}
