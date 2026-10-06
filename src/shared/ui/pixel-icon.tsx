import { cn } from "@/shared/lib/utils"

// 8×8 격자 도트 아이콘. "#"이 칠해지는 칸이다.
// Neo둥근모에 없는 기호만 여기서 그린다. 16px로 그리면 한 칸이 2px이 된다.
const pixelIconGrids = {
  sun: [
    "...##...",
    ".#....#.",
    "..####..",
    "#.####.#",
    "#.####.#",
    "..####..",
    ".#....#.",
    "...##...",
  ],
  moon: [
    "..####..",
    ".####...",
    "####....",
    "###.....",
    "###.....",
    "####....",
    ".####...",
    "..####..",
  ],
} satisfies Record<string, readonly string[]>

export type PixelIconName = keyof typeof pixelIconGrids

const toPath = (grid: readonly string[]) =>
  grid
    .flatMap((row, y) =>
      [...row].map((cell, x) => (cell === "#" ? `M${x} ${y}h1v1h-1z` : "")),
    )
    .join("")

type PixelIconProps = {
  name: PixelIconName
  className?: string
}

export function PixelIcon({ name, className }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 8 8"
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
    >
      <path d={toPath(pixelIconGrids[name])} />
    </svg>
  )
}
