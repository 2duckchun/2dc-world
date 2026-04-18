import { MarkdownContent as MarkdownRenderer } from "@/shared/lib/markdown"

type MarkdownContentProps = {
  markdown: string
}

export function MarkdownContent({ markdown }: MarkdownContentProps) {
  return (
    <div className="markdown-content">
      <MarkdownRenderer markdown={markdown} />
    </div>
  )
}
