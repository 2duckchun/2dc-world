export const slugPattern = /^[A-Za-z0-9-]+$/

export const normalizeSlug = (value: string) => value.normalize("NFKC").trim()

export const sanitizeSlugInput = (value: string) =>
  normalizeSlug(value).replace(/[^A-Za-z0-9-]/g, "")
