import type { CSSProperties } from "react"
import scene from "@/widgets/layouts/desktop-map/desktop-map-scene.json"

// 맵 그림(public/assets/desktop-map.svg)은 scripts/generate-desktop-map.mjs가 같은 scene.json으로 만든다.
// 16px 타일을 2배로 키워 그리므로 사람 위치와 이동 거리도 같은 배율로 맞춘다.
const MAP_SCALE = 2
const tilePx = scene.tileSize * MAP_SCALE

// 화면 뒤에 고정되는 장식 레이어. 본문 창만 그 위로 스크롤된다.
export const DesktopMap = () => {
  return (
    <div aria-hidden="true" className="desktop-map">
      <div
        className="desktop-map-scene"
        style={{
          width: scene.width * tilePx,
          height: scene.height * tilePx,
        }}
      >
        {scene.npcs.map((npc) => {
          const distancePx = npc.distance * tilePx

          return (
            <span
              key={`${npc.x}-${npc.y}`}
              className="map-npc"
              style={
                {
                  left: npc.x * tilePx,
                  top: npc.y * tilePx,
                  "--npc-variant": npc.variant,
                  "--npc-distance": `${distancePx}px`,
                  // 스프라이트 1픽셀(=화면 2px)씩 끊어 움직여야 도트가 번지지 않는다.
                  "--npc-steps": distancePx / MAP_SCALE,
                  "--npc-duration": `${npc.duration}s`,
                } as CSSProperties
              }
            />
          )
        })}
      </div>
    </div>
  )
}
