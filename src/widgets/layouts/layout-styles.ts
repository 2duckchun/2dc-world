import { cn } from "@/shared/lib/utils"

export type LayoutWidth = "reading" | "wide"

const layoutWidthClassName = {
  reading: "max-w-3xl",
  wide: "max-w-6xl",
} satisfies Record<LayoutWidth, string>

// 헤더, 본문 창, 푸터가 같은 폭과 좌우 여백을 써야 창 가장자리와 헤더·푸터 줄이 맞는다.
export const getLayoutContainerClassName = (width: LayoutWidth) =>
  cn("mx-auto w-full px-3 sm:px-6", layoutWidthClassName[width])

// 데스크톱(창 바깥) 위에 놓이는 텍스트 링크. 포인트 빨강은 틸 바탕에서 보이지 않으므로
// 밑줄은 글자색(currentColor)을 따른다. 관리자 스트립처럼 바탕이 달라져도 그대로 맞는다.
export const desktopLinkClassName =
  "cursor-pointer decoration-2 decoration-current underline-offset-4 hover:underline focus-visible:underline"
