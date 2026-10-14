"use client"

import { useTheme } from "next-themes"
import {
  type ReactNode,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog"

// mermaid.render는 같은 id를 가진 기존 요소를 DOM에서 지운다.
// 렌더할 때마다 새 id를 써서 테마 전환 중에도 화면의 다이어그램을 유지하고, 다이어그램끼리 스타일이 섞이지 않게 한다.
let renderCount = 0

async function renderMermaidSvg(
  chart: string,
  theme: string,
  fontFamily: string,
) {
  // mermaid는 용량이 커서 다이어그램이 있는 글에서만 불러온다.
  const { default: mermaid } = await import("mermaid")
  // 글자 폭을 재서 도형 크기를 정하므로, 본문 폰트가 준비된 뒤에 그려야 라벨이 잘리지 않는다.
  await document.fonts.ready
  mermaid.initialize({
    startOnLoad: false,
    theme: theme === "dark" ? "dark" : "neutral",
    fontFamily,
    suppressErrorRendering: true,
  })
  const result = await mermaid.render(`mermaid-diagram-${++renderCount}`, chart)
  return result.svg
}

// 그리지 못했으면(그리는 중, 문법 오류) undefined를 돌려준다.
// 글꼴은 본문 컨테이너에서 읽는다. 모달처럼 본문 밖(portal)에 그릴 때도 본문과 같은 글꼴로 맞추기 위해서다.
function useMermaidSvg(
  chart: string,
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState<string>()

  useEffect(() => {
    const container = containerRef.current
    if (!enabled || !container || !resolvedTheme) return

    let cancelled = false

    renderMermaidSvg(
      chart,
      resolvedTheme,
      getComputedStyle(container).fontFamily,
    )
      .then((nextSvg) => {
        if (!cancelled) setSvg(nextSvg)
      })
      .catch(() => {
        if (!cancelled) setSvg(undefined)
      })

    return () => {
      cancelled = true
    }
  }, [chart, containerRef, enabled, resolvedTheme])

  return svg
}

// 모달에서는 원본 너비(viewBox)를 기준으로 크기를 정한다.
// 넓은 화면에서는 원본의 2배까지 키우고, 좁은 화면에서는 원본 크기를 지킨 채 가로로 스크롤한다.
function ZoomedDiagram({ svg }: { svg: string }) {
  const ref = useRef<HTMLDivElement>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: svg가 바뀌면 innerHTML로 새 SVG 요소가 들어오므로 다시 맞춘다.
  useLayoutEffect(() => {
    const svgElement = ref.current?.querySelector("svg")
    const naturalWidth = svgElement?.viewBox.baseVal.width
    if (!svgElement || !naturalWidth) return

    svgElement.style.minWidth = `${naturalWidth}px`
    svgElement.style.maxWidth = `${naturalWidth * 2}px`
  }, [svg])

  return (
    <div
      ref={ref}
      className="[&>svg]:mx-auto"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: mermaid가 만든 SVG를 그대로 넣는다.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

type MermaidDiagramProps = {
  chart: string
  // 그리기 전이나 문법 오류로 그리지 못했을 때 대신 보여 줄 원본 코드 블록
  fallback: ReactNode
}

export function MermaidDiagram({ chart, fallback }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const svg = useMermaidSvg(chart, containerRef, true)
  // 같은 SVG를 두 번 넣으면 svg·화살표 marker id가 겹치므로, 모달을 열 때 새 id로 한 번 더 그린다.
  const zoomedSvg = useMermaidSvg(chart, containerRef, isZoomOpen)

  return (
    <div ref={containerRef}>
      {svg ? (
        <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
          <DialogTrigger
            aria-label="다이어그램 크게 보기"
            className="my-[2em] block w-full cursor-zoom-in outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:mx-auto"
          >
            <span
              className="block"
              // mermaid 기본 securityLevel(strict)이 라벨의 HTML을 정리한 SVG다.
              // biome-ignore lint/security/noDangerouslySetInnerHtml: mermaid가 만든 SVG를 그대로 넣는다.
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </DialogTrigger>
          <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-auto border-2 border-foreground bg-background p-6 pt-12 shadow-pixel ring-0 sm:max-w-[min(72rem,calc(100%-4rem))]">
            <DialogTitle className="sr-only">다이어그램 크게 보기</DialogTitle>
            {zoomedSvg && <ZoomedDiagram svg={zoomedSvg} />}
          </DialogContent>
        </Dialog>
      ) : (
        fallback
      )}
    </div>
  )
}
