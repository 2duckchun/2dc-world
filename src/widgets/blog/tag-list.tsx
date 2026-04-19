import Link from "next/link"
import { getTagRoute } from "@/domain/blog/model"
import { cn } from "@/shared/lib/utils"

type TagListProps = {
  tagNames: string[]
  className?: string
}

export function TagList({ tagNames, className }: TagListProps) {
  if (tagNames.length === 0) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tagNames.map((tagName) => (
        <Link
          key={tagName}
          href={getTagRoute(tagName)}
          className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
        >
          #{tagName}
        </Link>
      ))}
    </div>
  )
}
