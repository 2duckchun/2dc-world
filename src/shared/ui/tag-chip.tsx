import { cn } from "@/shared/lib/utils"

// 글자만으로는 날짜·종류와 섞여 보이므로 태그는 테마색(틸) 블록으로 구분한다.
const tagChipBaseClassName =
  "inline-flex items-center gap-1 bg-tag px-1.5 text-tag-foreground"

// 목록 안에서 읽기 전용으로 보여주는 태그
export function TagLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return <span className={cn(tagChipBaseClassName, className)} {...props} />
}

type TagFilterButtonProps = Omit<
  React.ComponentProps<"button">,
  "type" | "aria-pressed"
> & {
  isSelected: boolean
}

// 태그 필터 버튼. 선택된 칩은 진한 틸로 반전한다.
export function TagFilterButton({
  isSelected,
  className,
  ...props
}: TagFilterButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className={cn(
        tagChipBaseClassName,
        "cursor-pointer px-2",
        isSelected
          ? "bg-tag-foreground text-background"
          : "hover:outline-2 hover:outline-tag-foreground hover:-outline-offset-2",
        className,
      )}
      {...props}
    />
  )
}
