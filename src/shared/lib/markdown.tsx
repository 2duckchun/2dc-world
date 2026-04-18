import { Fragment, type ReactNode } from "react"

function trimPipe(value: string) {
  return value.trim().replace(/^\|/, "").replace(/\|$/, "")
}

function splitTableRow(value: string) {
  return trimPipe(value)
    .split("|")
    .map((cell) => cell.trim())
}

function isTableSeparator(value: string) {
  return /^\|?\s*:?-{3,}:?(\s*\|\s*:?-{3,}:?)*\s*\|?$/.test(value.trim())
}

function isTableRow(value: string) {
  return value.includes("|")
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

function parseInline(markdown: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern =
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)|\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g

  let lastIndex = 0
  let matchIndex = 0

  for (const match of markdown.matchAll(pattern)) {
    const index = match.index ?? 0

    if (index > lastIndex) {
      nodes.push(markdown.slice(lastIndex, index))
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      nodes.push(
        // biome-ignore lint/performance/noImgElement: Markdown content uses remote images with unknown dimensions.
        <img
          key={`${keyPrefix}-img-${matchIndex}`}
          src={match[2]}
          alt={match[1]}
          title={match[3]}
        />,
      )
    } else if (match[4] !== undefined && match[5] !== undefined) {
      nodes.push(
        <a key={`${keyPrefix}-link-${matchIndex}`} href={match[5]}>
          {match[4]}
        </a>,
      )
    } else if (match[6] !== undefined) {
      nodes.push(
        <code key={`${keyPrefix}-code-${matchIndex}`}>{match[6]}</code>,
      )
    } else if (match[7] !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-strong-${matchIndex}`}>{match[7]}</strong>,
      )
    } else if (match[8] !== undefined) {
      nodes.push(<em key={`${keyPrefix}-em-${matchIndex}`}>{match[8]}</em>)
    }

    lastIndex = index + match[0].length
    matchIndex += 1
  }

  if (lastIndex < markdown.length) {
    nodes.push(markdown.slice(lastIndex))
  }

  return nodes
}

function renderMarkdownBlocks(markdown: string, keyPrefix = "md"): ReactNode[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n")
  const blocks: ReactNode[] = []

  for (let index = 0; index < lines.length; ) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    const blockKey = `${keyPrefix}-${index}`
    const codeFence = trimmed.match(/^```(.*)$/)

    if (codeFence) {
      const language = codeFence[1].trim()
      const body: string[] = []
      index += 1

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        body.push(lines[index])
        index += 1
      }

      if (index < lines.length) {
        index += 1
      }

      blocks.push(
        <pre key={blockKey}>
          <code className={language ? `language-${language}` : undefined}>
            {body.join("\n")}
          </code>
        </pre>,
      )
      continue
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/)

    if (heading) {
      const level = heading[1].length
      const text = heading[2].trim()
      const headingId = slugifyHeading(text)
      const content = parseInline(text, blockKey)

      if (level === 1) {
        blocks.push(
          <h1 key={blockKey} id={headingId || undefined}>
            {content}
          </h1>,
        )
      } else if (level === 2) {
        blocks.push(
          <h2 key={blockKey} id={headingId || undefined}>
            {content}
          </h2>,
        )
      } else if (level === 3) {
        blocks.push(
          <h3 key={blockKey} id={headingId || undefined}>
            {content}
          </h3>,
        )
      } else if (level === 4) {
        blocks.push(
          <h4 key={blockKey} id={headingId || undefined}>
            {content}
          </h4>,
        )
      } else if (level === 5) {
        blocks.push(
          <h5 key={blockKey} id={headingId || undefined}>
            {content}
          </h5>,
        )
      } else {
        blocks.push(
          <h6 key={blockKey} id={headingId || undefined}>
            {content}
          </h6>,
        )
      }

      index += 1
      continue
    }

    if (trimmed.startsWith(">")) {
      const blockquoteLines: string[] = []

      while (index < lines.length && lines[index].trim().startsWith(">")) {
        blockquoteLines.push(lines[index].replace(/^>\s?/, ""))
        index += 1
      }

      blocks.push(
        <blockquote key={blockKey}>
          {renderMarkdownBlocks(
            blockquoteLines.join("\n"),
            `${blockKey}-quote`,
          )}
        </blockquote>,
      )
      continue
    }

    if (
      isTableRow(line) &&
      index + 1 < lines.length &&
      isTableSeparator(lines[index + 1])
    ) {
      const tableLines = [line, lines[index + 1]]
      index += 2

      while (
        index < lines.length &&
        isTableRow(lines[index]) &&
        lines[index].trim()
      ) {
        tableLines.push(lines[index])
        index += 1
      }

      const [head, , ...body] = tableLines
      const headers = splitTableRow(head)
      const rows = body.map((row) => splitTableRow(row))

      blocks.push(
        <table key={blockKey}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={`${blockKey}-head-${header}`}>
                  {parseInline(header, `${blockKey}-head-${header}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${blockKey}-row-${row.join("|")}`}>
                {row.map((cell) => (
                  <td key={`${blockKey}-cell-${row.join("|")}-${cell}`}>
                    {parseInline(
                      cell,
                      `${blockKey}-cell-${row.join("|")}-${cell}`,
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>,
      )
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const listLines: string[] = []

      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        listLines.push(lines[index].trim())
        index += 1
      }

      blocks.push(
        <ul key={blockKey}>
          {listLines.map((item) => (
            <li key={`${blockKey}-item-${item}`}>
              {parseInline(
                item.replace(/^[-*]\s+/, ""),
                `${blockKey}-item-${item}`,
              )}
            </li>
          ))}
        </ul>,
      )
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const listLines: string[] = []

      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        listLines.push(lines[index].trim())
        index += 1
      }

      blocks.push(
        <ol key={blockKey}>
          {listLines.map((item) => (
            <li key={`${blockKey}-item-${item}`}>
              {parseInline(
                item.replace(/^\d+\.\s+/, ""),
                `${blockKey}-item-${item}`,
              )}
            </li>
          ))}
        </ol>,
      )
      continue
    }

    const paragraphLines: string[] = []

    while (index < lines.length) {
      const candidate = lines[index]
      const candidateTrimmed = candidate.trim()

      if (!candidateTrimmed) {
        break
      }

      if (
        candidateTrimmed.startsWith(">") ||
        candidateTrimmed.startsWith("```") ||
        /^(#{1,6})\s+/.test(candidateTrimmed) ||
        /^[-*]\s+/.test(candidateTrimmed) ||
        /^\d+\.\s+/.test(candidateTrimmed) ||
        (isTableRow(candidate) &&
          index + 1 < lines.length &&
          isTableSeparator(lines[index + 1]))
      ) {
        break
      }

      paragraphLines.push(candidateTrimmed)
      index += 1
    }

    blocks.push(
      <p key={blockKey}>
        {parseInline(paragraphLines.join(" "), `${blockKey}-paragraph`)}
      </p>,
    )
  }

  return blocks
}

export function markdownToPlainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\(([^)]+)\)/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[#>*_`|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function markdownToExcerpt(markdown: string, length = 160) {
  const plain = markdownToPlainText(markdown)

  if (plain.length <= length) {
    return plain
  }

  return `${plain.slice(0, length).trimEnd()}…`
}

export function MarkdownContent({ markdown }: { markdown: string }): ReactNode {
  return <Fragment>{renderMarkdownBlocks(markdown)}</Fragment>
}
