export function normalizeMarkdown(markdown: string) {
  return markdown.replace(/\r\n?/g, "\n").trim()
}

export function stripMarkdownToText(markdown: string) {
  const normalized = normalizeMarkdown(markdown)

  if (!normalized) {
    return ""
  }

  return normalized
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\|/g, " ")
    .replace(/[*_~>#]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function estimateReadingMinutes(markdown: string, wordsPerMinute = 220) {
  const wordCount = stripMarkdownToText(markdown)
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.round(wordCount / wordsPerMinute) || 1)
}

export function buildExcerpt(
  summary: string | null | undefined,
  markdown: string,
  maxLength = 180,
) {
  const source = (summary ?? "").trim() || stripMarkdownToText(markdown)

  if (!source) {
    return "No summary yet — this post is ready for its first published sentence."
  }

  if (source.length <= maxLength) {
    return source
  }

  return `${source
    .slice(0, maxLength)
    .replace(/\s+\S*$/, "")
    .trim()}…`
}
