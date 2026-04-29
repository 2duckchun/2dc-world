import { Hash, Layers2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import type { HomeContentTag } from "@/views/home/sections/home-content-explorer-section/components/home-content-explorer"

export type HomeTagOption = HomeContentTag & {
  count: number
}

type HomeTagFilterProps = {
  tags: readonly HomeTagOption[]
  selectedTagSlug: string | null
  totalCount: number
  filteredCount: number
  onTagChange: (tagSlug: string | null) => void
}

export function HomeTagFilter({
  tags,
  selectedTagSlug,
  totalCount,
  filteredCount,
  onTagChange,
}: HomeTagFilterProps) {
  const selectedTag =
    selectedTagSlug === null
      ? null
      : (tags.find((tag) => tag.slug === selectedTagSlug) ?? null)

  return (
    <section
      aria-label="홈 콘텐츠 태그 필터"
      className="grid gap-3 border-border border-t bg-card/70 p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium text-sm">
          <Hash className="size-4 text-chart-3" />
          <span>Tags</span>
        </div>
        <p className="text-muted-foreground text-sm">
          {selectedTag
            ? `${selectedTag.name} ${filteredCount.toLocaleString("ko-KR")}개`
            : `전체 ${totalCount.toLocaleString("ko-KR")}개`}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={selectedTagSlug === null ? "secondary" : "outline"}
          size="sm"
          aria-pressed={selectedTagSlug === null}
          onClick={() => onTagChange(null)}
        >
          <Layers2 data-icon="inline-start" className="size-3.5" />
          전체
        </Button>
        {tags.map((tag) => (
          <Button
            key={tag.slug}
            type="button"
            variant={selectedTagSlug === tag.slug ? "secondary" : "outline"}
            size="sm"
            aria-pressed={selectedTagSlug === tag.slug}
            onClick={() => onTagChange(tag.slug)}
          >
            <Hash data-icon="inline-start" className="size-3.5" />
            {tag.name}
            <span className="text-muted-foreground tabular-nums">
              {tag.count}
            </span>
          </Button>
        ))}
      </div>
    </section>
  )
}
