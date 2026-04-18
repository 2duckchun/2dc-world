export function normalizeTagName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ")
}

export function normalizeTagNames(values: string[]) {
  return [...new Set(values.map(normalizeTagName).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  )
}
