import { TagFilterButton } from "@/shared/ui/tag-chip"
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
    <section aria-label="홈 콘텐츠 태그 필터" className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-muted-foreground">
        <span>TAGS</span>
        <p>
          {selectedTag
            ? `#${selectedTag.name} ${filteredCount.toLocaleString("ko-KR")}개`
            : `전체 ${totalCount.toLocaleString("ko-KR")}개`}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <TagFilterButton
          isSelected={selectedTagSlug === null}
          onClick={() => onTagChange(null)}
        >
          전체
        </TagFilterButton>
        {tags.map((tag) => {
          const isSelected = selectedTagSlug === tag.slug

          return (
            <TagFilterButton
              key={tag.slug}
              isSelected={isSelected}
              onClick={() => onTagChange(tag.slug)}
            >
              #{tag.name}
              <span className="tabular-nums">{tag.count}</span>
            </TagFilterButton>
          )
        })}
      </div>
    </section>
  )
}
