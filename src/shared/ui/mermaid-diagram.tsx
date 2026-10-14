"use client"

import { useTheme } from "next-themes"
import { type ReactNode, useEffect, useRef, useState } from "react"

// mermaid.render는 같은 id를 가진 기존 요소를 DOM에서 지운다.
// 렌더할 때마다 새 id를 써서 테마 전환 중에도 화면의 다이어그램을 유지하고, 다이어그램끼리 스타일이 섞이지 않게 한다.
let renderCount = 0

type MermaidDiagramProps = {
  chart: string
  // 그리기 전이나 문법 오류로 그리지 못했을 때 대신 보여 줄 원본 코드 블록
  fallback: ReactNode
}

export function MermaidDiagram({ chart, fallback }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState<string>()

  useEffect(() => {
    const container = containerRef.current
    if (!container || !resolvedTheme) return

    let cancelled = false

    async function renderChart(container: HTMLDivElement) {
      // mermaid는 용량이 커서 다이어그램이 있는 글에서만 불러온다.
      const { default: mermaid } = await import("mermaid")
      // 글자 폭을 재서 도형 크기를 정하므로, 본문 폰트가 준비된 뒤에 그려야 라벨이 잘리지 않는다.
      await document.fonts.ready
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "neutral",
        fontFamily: getComputedStyle(container).fontFamily,
        suppressErrorRendering: true,
      })
      const result = await mermaid.render(
        `mermaid-diagram-${++renderCount}`,
        chart,
      )
      return result.svg
    }

    renderChart(container)
      .then((nextSvg) => {
        if (!cancelled) setSvg(nextSvg)
      })
      .catch(() => {
        if (!cancelled) setSvg(undefined)
      })

    return () => {
      cancelled = true
    }
  }, [chart, resolvedTheme])

  return (
    <div ref={containerRef}>
      {svg ? (
        <div
          className="my-[2em] [&>svg]:mx-auto"
          // mermaid 기본 securityLevel(strict)이 라벨의 HTML을 정리한 SVG다.
          // biome-ignore lint/security/noDangerouslySetInnerHtml: mermaid가 만든 SVG를 그대로 넣는다.
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        fallback
      )}
    </div>
  )
}
