import type { CSSProperties } from "react"
import scene from "@/widgets/layouts/desktop-map/desktop-map-scene.json"

// 맵 그림(public/assets/desktop-map.svg)은 scripts/generate-desktop-map.mjs가 같은 scene.json으로 만든다.
// 16px 타일을 2배로 키워 그리므로 동물 위치도 같은 배율로 맞춘다.
const MAP_SCALE = 2
const tilePx = scene.tileSize * MAP_SCALE

// 동물들이 한꺼번에 짖지 않도록 짖는 주기와 시작 시점을 조금씩 어긋나게 한다.
const getBarkTiming = (index: number) => ({
  duration: 3 + (index % 3) * 0.9,
  delay: -index * 1.3,
})

// 화면 뒤에 고정되는 장식 레이어. 본문 창만 그 위로 스크롤된다.
export const DesktopMap = () => {
  const mapHeight = scene.height * tilePx

  return (
    <div aria-hidden="true" className="desktop-map">
      <div
        className="desktop-map-scene"
        style={
          {
            width: scene.width * tilePx,
            height: mapHeight,
            // 스크롤 패럴랙스가 맵 끝까지 움직일 거리를 계산할 때 쓴다.
            "--map-height": `${mapHeight}px`,
          } as CSSProperties
        }
      >
        {scene.pets.map((pet, index) => {
          const { duration, delay } = getBarkTiming(index)

          return (
            <span
              key={`${pet.x}-${pet.y}`}
              className="map-pet"
              data-facing={pet.facing}
              style={
                {
                  left: pet.x * tilePx,
                  top: pet.y * tilePx,
                  // 스프라이트 시트(public/assets/map-pets.svg)의 행 번호
                  "--pet-row": scene.petKinds.indexOf(pet.kind),
                  "--pet-duration": `${duration}s`,
                  "--pet-delay": `${delay}s`,
                } as CSSProperties
              }
            />
          )
        })}
      </div>
    </div>
  )
}
