import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { normalizeMarkdown } from "@/shared/lib/markdown-text"
import { cn } from "@/shared/lib/utils"

type MarkdownContentProps = {
  markdown: string
  className?: string
}

export function MarkdownContent({ markdown, className }: MarkdownContentProps) {
  const content = normalizeMarkdown(markdown)

  if (!content) {
    return null
  }

  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown
        components={{
          a({ href, ...props }) {
            const isExternal =
              href?.startsWith("http://") || href?.startsWith("https://")

            return (
              <a
                href={href}
                rel={isExternal ? "noreferrer" : undefined}
                target={isExternal ? "_blank" : undefined}
                {...props}
              />
            )
          },
          img({ alt, src, ...props }) {
            return (
              // biome-ignore lint/performance/noImgElement: markdown images may point to arbitrary remote or relative URLs, so Next Image is not a drop-in replacement here.
              <img alt={alt ?? ""} src={src ?? ""} {...props} />
            )
          },
          table({ children, ...props }) {
            return (
              <div className="my-6 w-full overflow-x-auto">
                <table {...props}>{children}</table>
              </div>
            )
          },
        }}
        remarkPlugins={[remarkGfm]}
        skipHtml
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
