export type NormalizedTag = {
  name: string
  slug: string
}

export const normalizeTagName = (value: string) =>
  value
    .normalize("NFKC")
    .replace(/^(?:#\s*)+/, "")
    .trim()
    .replace(/\s+/g, " ")

export const createTagSlug = (value: string) =>
  normalizeTagName(value).toLowerCase().replace(/\s+/g, "-")

export const normalizeTagInput = (value: string): NormalizedTag | null => {
  const name = normalizeTagName(value)
  const slug = createTagSlug(name)

  if (!name || !slug) {
    return null
  }

  return { name, slug }
}

export const normalizeTagInputs = (
  values: readonly string[],
): NormalizedTag[] => {
  const tagsBySlug = new Map<string, NormalizedTag>()

  for (const value of values) {
    const tag = normalizeTagInput(value)

    if (tag && !tagsBySlug.has(tag.slug)) {
      tagsBySlug.set(tag.slug, tag)
    }
  }

  return [...tagsBySlug.values()]
}

export const normalizeTagNames = (values: readonly string[]) =>
  normalizeTagInputs(values).map((tag) => tag.name)
