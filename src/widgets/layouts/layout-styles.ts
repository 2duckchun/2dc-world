import { cn } from "@/shared/lib/utils"

export type LayoutWidth = "reading" | "wide"

const layoutWidthClassName = {
  reading: "max-w-3xl",
  wide: "max-w-6xl",
} satisfies Record<LayoutWidth, string>

// 헤더, 본문 창, 푸터가 같은 폭과 좌우 여백을 써야 세 박스의 가장자리가 맞는다.
export const getLayoutContainerClassName = (width: LayoutWidth) =>
  cn("mx-auto w-full px-3 sm:px-6", layoutWidthClassName[width])

// 필드 맵 위에 떠 있는 종이 박스. 맵 위에 글자를 직접 올리지 않도록 헤더·본문·푸터가 모두 이 박스를 쓴다.
export const layoutPanelClassName =
  "border-2 border-foreground bg-background shadow-pixel"

// 헤더·푸터의 텍스트 링크. hover·포커스 시 포인트색 밑줄을 긋는다.
export const layoutLinkClassName =
  "cursor-pointer decoration-2 decoration-point underline-offset-4 hover:underline focus-visible:underline"
