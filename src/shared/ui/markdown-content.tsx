import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"
import { cn } from "@/shared/lib/utils"

type MarkdownContentProps = {
  markdown: string
  className?: string
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
          [rehypeHighlight, { plainText: ["text", "txt", "plain"] }],
        ]}
        skipHtml
      >
        {markdown}
      </Markdown>
    </article>
  )
}
