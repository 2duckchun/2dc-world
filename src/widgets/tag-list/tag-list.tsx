import Link from "next/link"
import { buildTagHref, type PublishedTag } from "@/domain/blog/lib/model"

type TagListProps = {
  tags: PublishedTag[]
}

export function TagList({ tags }: TagListProps) {
  if (tags.length === 0) {
    return null
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag.id}>
          <Link
            href={buildTagHref(tag.name)}
            className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition hover:bg-secondary/80"
          >
            #{tag.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
