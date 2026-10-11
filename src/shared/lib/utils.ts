import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// globals.css에 추가한 글자 크기(text-reading, text-reading-sm)를 글자색이 아닌 크기로 인식시킨다.
// 등록하지 않으면 text-muted-foreground 같은 색 클래스와 충돌한다고 보고 한쪽을 지운다.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["reading", "reading-sm"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
