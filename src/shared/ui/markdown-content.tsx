import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/shared/lib/utils"

type MarkdownContentProps = {
  markdown: string
  className?: string
}

export function MarkdownContent({ markdown, className }: MarkdownContentProps) {
  return (
    <article
      className={cn("prose prose-blog max-w-none dark:prose-invert", className)}
    >
      <Markdown remarkPlugins={[remarkGfm]} skipHtml>
        {markdown}
      </Markdown>
    </article>
  )
}
