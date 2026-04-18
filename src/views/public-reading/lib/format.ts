export function formatDateLabel(value: string | null) {
  if (!value) {
    return null
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(parsed)
}

export function estimateReadingTime(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length

  if (words === 0) {
    return null
  }

  return `${Math.max(1, Math.ceil(words / 220))} min read`
}
