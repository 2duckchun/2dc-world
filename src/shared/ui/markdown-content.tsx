import Markdown, { type Components, type ExtraProps } from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import { cn } from "@/shared/lib/utils"
import { MermaidDiagram } from "@/shared/ui/mermaid-diagram"

type MarkdownContentProps = {
  markdown: string
  className?: string
}

// ```mermaid 코드 블록(pre > code.language-mermaid)이면 다이어그램 원본 텍스트를 돌려준다.
function getMermaidChart(node: ExtraProps["node"]) {
  const code = node?.children[0]
  if (code?.type !== "element" || code.tagName !== "code") return

  const { className } = code.properties
  if (!Array.isArray(className) || !className.includes("language-mermaid")) {
    return
  }

  return code.children
    .map((child) => (child.type === "text" ? child.value : ""))
    .join("")
}

const components: Components = {
  pre({ node, ...props }) {
    const chart = getMermaidChart(node)
    if (chart === undefined) return <pre {...props} />

    return <MermaidDiagram chart={chart} fallback={<pre {...props} />} />
  },
}

export function MarkdownContent({ markdown, className }: MarkdownContentProps) {
  return (
    <article
      className={cn(
        "prose prose-blog w-full max-w-full min-w-0 dark:prose-invert",
        className,
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSanitize,
          [rehypeHighlight, { plainText: ["text", "txt", "plain", "mermaid"] }],
        ]}
        components={components}
      >
        {markdown}
      </Markdown>
    </article>
  )
}
