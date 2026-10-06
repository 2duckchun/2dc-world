import { cn } from "@/shared/lib/utils"

export type LayoutWidth = "reading" | "wide"

const layoutWidthClassName = {
  reading: "max-w-3xl",
  wide: "max-w-6xl",
} satisfies Record<LayoutWidth, string>

// 헤더, 본문 창, 푸터가 같은 폭과 좌우 여백을 써야 창 가장자리와 헤더·푸터 줄이 맞는다.
export const getLayoutContainerClassName = (width: LayoutWidth) =>
  cn("mx-auto w-full px-3 sm:px-6", layoutWidthClassName[width])

// 데스크톱(창 바깥) 위에 놓이는 텍스트 링크. 라이트 모드에서 포인트색은 바탕 대비가
// 4.5:1에 못 미치므로 글자색은 그대로 두고 밑줄에만 포인트색을 쓴다.
export const desktopLinkClassName =
  "cursor-pointer decoration-2 decoration-point underline-offset-4 hover:underline focus-visible:underline"
