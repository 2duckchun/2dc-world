export const postKindValues = ["post", "log", "series"] as const
export const postStatusValues = ["draft", "published", "archived"] as const

export type PostKind = (typeof postKindValues)[number]
export type PostStatus = (typeof postStatusValues)[number]

export const postKindLabels = {
  post: "Post",
  log: "Log",
  series: "Series",
} satisfies Record<PostKind, string>

export const postStatusLabels = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
} satisfies Record<PostStatus, string>
