// 데스크톱 배경 맵과 맵 위에 앉아 있는 동물 스프라이트를 SVG로 생성한다.
//
//   node scripts/generate-desktop-map.mjs
//
// 장면 배치(길, 연못, 집, 나무 등)는 desktop-map-scene.json에서 읽는다.
// 같은 JSON을 화면 컴포넌트가 동물 위치로 쓰므로, 배치를 바꾸면 이 스크립트를 다시 실행한다.
// 그림은 게임보이 어드밴스 RPG 필드 분위기를 참고해 직접 그린 원본 도트이며 실제 게임 에셋은 쓰지 않는다.
//
// 픽셀 격자 문자열이 많아 이 파일은 맞춤법 검사에서 뺀다.
// cspell:disable

import { readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const scene = JSON.parse(
  readFileSync(
    resolve(root, "src/widgets/layouts/desktop-map/desktop-map-scene.json"),
    "utf8",
  ),
)
const T = scene.tileSize

const color = {
  grass: "#8ACD6E",
  grassDark: "#6FB65A",
  grassLight: "#A9DE8C",
  tallBase: "#5DAE4F",
  tallDark: "#3C8A43",
  tallLight: "#8FD46C",
  sand: "#EAD9A2",
  sandDark: "#D3BC80",
  sandLight: "#F6EAC4",
  water: "#5AA9E6",
  waterDeep: "#3F8BD0",
  waterLight: "#BEE5FF",
  waterRim: "#2F6E9E",
  lily: "#4FA65A",
  lilyLight: "#7DD27F",
  leaf: "#46A04A",
  leafDark: "#2E7A3B",
  leafLight: "#7DCB5E",
  treeLine: "#1F4D2B",
  trunk: "#8A5A2E",
  trunkDark: "#5E3A1C",
  line: "#33302E",
  wall: "#F6EEDC",
  wallShade: "#D9CBAE",
  glass: "#7EC6F0",
  glassDark: "#3F80B8",
  frame: "#6A4E36",
  door: "#9A6232",
  doorDark: "#6E4220",
  knob: "#F2C445",
  brick: "#B65A44",
  fence: "#D49C60",
  fenceDark: "#8E5E30",
  fenceLight: "#F0C283",
  red: "#E8504A",
  yellow: "#F8D840",
  white: "#FFFFFF",
  pollen: "#F0A020",
}

const roofs = {
  red: { R: "#D9473B", D: "#A8302B", L: "#F2786A" },
  blue: { R: "#4C7BD2", D: "#2F5AA8", L: "#82A9EE" },
  green: { R: "#4FA463", D: "#357A47", L: "#82CF8F" },
}

// 문자 격자를 색별 path로 바꾼다. 가로로 이어진 같은 문자는 한 줄로 합쳐 파일 크기를 줄인다.
const gridToPaths = (rows, legend) => {
  const runs = new Map()
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const fill = legend[row[x]]
      let end = x
      while (end + 1 < row.length && row[end + 1] === row[x]) end++
      if (fill) {
        const n = end - x + 1
        runs.set(fill, `${runs.get(fill) ?? ""}M${x} ${y}h${n}v1h-${n}z`)
      }
      x = end + 1
    }
  })
  return [...runs]
    .map(([fill, d]) => `<path fill="${fill}" d="${d}"/>`)
    .join("")
}

// 큰 스프라이트(집, 울타리)는 사각형을 겹쳐 그린 뒤 격자로 바꾼다.
const createCanvas = (width, height) =>
  Array.from({ length: height }, () => Array(width).fill("."))

const fillRect = (canvas, x, y, width, height, char) => {
  for (let row = y; row < y + height; row++) {
    for (let col = x; col < x + width; col++) {
      if (canvas[row]?.[col] !== undefined) canvas[row][col] = char
    }
  }
}

const toRows = (canvas) => canvas.map((row) => row.join(""))

const symbol = (id, width, height, body) =>
  `<symbol id="${id}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${body}</symbol>`

const drawHouse = () => {
  const c = createCanvas(80, 64)
  // 굴뚝
  fillRect(c, 58, 0, 8, 12, "k")
  fillRect(c, 59, 1, 6, 10, "b")
  fillRect(c, 59, 4, 6, 1, "k")
  // 지붕: 벽보다 양옆으로 넓게 내밀고, 기와 줄을 6px 간격으로 넣는다.
  fillRect(c, 1, 6, 78, 28, "k")
  fillRect(c, 2, 7, 76, 26, "R")
  fillRect(c, 2, 7, 76, 3, "L")
  for (let y = 13; y < 33; y += 6) {
    fillRect(c, 2, y, 76, 1, "D")
    const offset = (y / 6) % 2 === 0 ? 2 : 6
    for (let x = 2 + offset; x < 78; x += 8) fillRect(c, x, y - 5, 1, 5, "D")
  }
  fillRect(c, 2, 32, 76, 1, "D")
  // 벽
  fillRect(c, 5, 34, 70, 30, "k")
  fillRect(c, 6, 34, 68, 29, "c")
  fillRect(c, 6, 34, 68, 2, "C")
  fillRect(c, 6, 61, 68, 2, "C")
  // 창문
  for (const x of [12, 54]) {
    fillRect(c, x, 40, 14, 12, "f")
    fillRect(c, x + 1, 41, 12, 10, "n")
    fillRect(c, x + 1, 46, 12, 5, "N")
    fillRect(c, x + 7, 41, 1, 10, "f")
    fillRect(c, x + 1, 46, 12, 1, "f")
    fillRect(c, x + 2, 42, 2, 2, "w")
  }
  // 문
  fillRect(c, 33, 44, 14, 20, "k")
  fillRect(c, 34, 45, 12, 19, "o")
  fillRect(c, 34, 45, 12, 2, "O")
  fillRect(c, 43, 54, 2, 2, "y")
  return toRows(c)
}

const houseLegend = (roof) => ({
  k: color.line,
  b: color.brick,
  R: roof.R,
  D: roof.D,
  L: roof.L,
  c: color.wall,
  C: color.wallShade,
  f: color.frame,
  n: color.glass,
  N: color.glassDark,
  w: color.white,
  o: color.door,
  O: color.doorDark,
  y: color.knob,
})

const tree = [
  "....kkkkkkkk....",
  "..kkmmmmmmmmkk..",
  ".kmmLLLmmmmmmmk.",
  ".kmLLLmmmmmmdmk.",
  "kmmLLmmmmmmmddmk",
  "kmmmmmmmmmmdddmk",
  "kmmmmmLLmmmmddmk",
  "kmdmmLLLmmmmmmdk",
  "kmddmmLmmmmmmddk",
  "kmmddmmmmmLLddmk",
  "kmmmddmmmmLLLdmk",
  ".kmmmdddmmmLddk.",
  ".kdmmmmdddddddk.",
  "..kddmmmmmmddk..",
  "...kkddddddkk...",
  ".....kkkkkk.....",
  "......ktTk......",
  "......ktTk......",
  "....ggktTkgg....",
  ".....gggggg.....",
]

const treeLegend = {
  k: color.treeLine,
  m: color.leaf,
  L: color.leafLight,
  d: color.leafDark,
  t: color.trunk,
  T: color.trunkDark,
  g: color.grassDark,
}

const drawFence = () => {
  const c = createCanvas(16, 16)
  for (const y of [6, 11]) {
    fillRect(c, 0, y, 16, 1, "k")
    fillRect(c, 0, y + 1, 16, 1, "l")
    fillRect(c, 0, y + 2, 16, 1, "F")
  }
  for (const x of [1, 9]) {
    fillRect(c, x, 3, 4, 12, "k")
    fillRect(c, x + 1, 4, 2, 10, "F")
    fillRect(c, x + 1, 4, 1, 10, "l")
    fillRect(c, x, 15, 4, 1, "g")
  }
  return toRows(c)
}

const fenceLegend = {
  k: color.fenceDark,
  F: color.fence,
  l: color.fenceLight,
  g: color.grassDark,
}

const flowers = [
  "................",
  "...r............",
  "..rpr.......y...",
  "...r.......ypy..",
  "...g........y...",
  "..ghg.......g...",
  "...........ghg..",
  "................",
  "........w.......",
  ".......wpw......",
  "........w.......",
  "........g.......",
  ".......ghg......",
  "................",
  "................",
  "................",
]

const flowerLegend = {
  r: color.red,
  y: color.yellow,
  w: color.white,
  p: color.pollen,
  g: color.grassDark,
  h: color.grassLight,
}

const sign = [
  "................",
  "................",
  "..kkkkkkkkkkkk..",
  "..kllllllllllk..",
  "..klkkFkkkFFlk..",
  "..kFFFFFFFFFFk..",
  "..klkkkFkkFFlk..",
  "..kFFFFFFFFFFk..",
  "..kkkkkkkkkkkk..",
  "......kFlk......",
  "......kFlk......",
  "......kFlk......",
  ".....gkkkkg.....",
  "................",
  "................",
  "................",
]

const signLegend = {
  k: color.fenceDark,
  F: color.fence,
  l: color.fenceLight,
  g: color.grassDark,
}

const lilyPad = [
  "..lll...",
  ".lLLLl..",
  "lLLlLLl.",
  "lLL.LLl.",
  ".lLLLl..",
  "..lll...",
]

const lilyLegend = { l: color.lily, L: color.lilyLight }

// 앉아 있는 동물 옆모습(오른쪽을 봄). 24x16 격자이고 오른쪽 끝은 소리 표시 자리다.
// 첫 프레임은 가만히 있는 모습, 둘째 프레임은 고개를 들고 입을 벌려 짖거나 우는 모습이다.
const PET_WIDTH = 24
const PET_HEIGHT = 16
const padPet = (rows) => rows.map((row) => row.padEnd(PET_WIDTH, "."))

// 진돗개: 등 위로 말린 꼬리
const dogFrames = [
  padPet([
    "",
    "...........k...k",
    "..........kbk.kbk",
    "..........kbbkbbbk",
    "..........kbbbbbbk",
    "..........kbbbbbebk",
    "..........kbbbbbbbnk",
    "..kkk.....kbbbbllkk",
    ".kbbbk...kbbbllk",
    ".kbkbk..kbbbbllk",
    ".kbbk..kbbbbbllk",
    "..kbkkkbbbbbbllk",
    "...kbbbbbbbbkllk",
    "...kbbdbbbbkbllk",
    "...kbbdbbbbkbllk",
    "...kkkkkkkkkkkkk",
  ]),
  padPet([
    "...........k...k",
    "..........kbk.kbk",
    "..........kbbkbbbk",
    "..........kbbbbbbk....w",
    "..........kbbbbbebk....w",
    "..........kbbbbbbbnk",
    "...kkk....kbbbbkmmk...w",
    "..kbbbk...kbbbllkk...w",
    "..kbkbk..kbbbllk",
    "..kbbk..kbbbbllk",
    "...kbk.kbbbbbllk",
    "...kbkkbbbbbbllk",
    "...kbbbbbbbbkllk",
    "...kbbdbbbbkbllk",
    "...kbbdbbbbkbllk",
    "...kkkkkkkkkkkkk",
  ]),
]

// 고양이: 바닥을 따라 앞으로 감은 꼬리, s는 줄무늬
const catFrames = [
  padPet([
    "",
    "...........k..k",
    "..........kbkkbk",
    "..........kbsbbbk",
    "..........kbbbbebk",
    "..........kbbbbbbnk",
    "..........kbbbllkk",
    "..........kbbllk",
    ".........kbsbllk",
    "........kbsbbllk",
    ".......kbsbbbllk",
    "......kbbbbbbllk",
    "......kbsbbkbllk",
    "..kkk.kbbbbkbllk",
    ".kbsbkkbbbbkbllk",
    "..kkkkkkkkkkkkkk",
  ]),
  padPet([
    "...........k..k",
    "..........kbkkbk",
    "..........kbsbbbk",
    "..........kbbbbebk....w",
    "..........kbbbbbbnk..w",
    "..........kbbbbkmk",
    "..........kbbllkk.....w",
    "..........kbbllk....w",
    ".........kbsbllk",
    "........kbsbbllk",
    ".......kbsbbbllk",
    "......kbbbbbbllk",
    "......kbsbbkbllk",
    "...kk.kbbbbkbllk",
    "..kbskkbbbbkbllk",
    "..kkkkkkkkkkkkkk",
  ]),
]

// 정면 모습. 좌우 대칭이라 왼쪽 절반(가운데 열 포함 8칸)만 그리고 오른쪽은 거울로 복사한다.
// 15칸 너비 그림을 24칸 캔버스 가운데에 두고, 꼬리와 소리 표시처럼 대칭이 아닌 부분은 좌표로 덧그린다.
const mirrorPet = (halves) =>
  padPet(
    halves.map((half) => {
      const left = half.padEnd(8, ".")
      return `....${left}${[...left.slice(0, -1)].reverse().join("")}`
    }),
  )

const overlayPet = (rows, marks) => {
  const grid = rows.map((row) => [...row])
  for (const [x, y, char] of marks) grid[y][x] = char
  return grid.map((row) => row.join(""))
}

// 진돗개 말린 꼬리(정면에서는 오른쪽 등 뒤로 보인다). 짖을 때는 한 칸 위·오른쪽으로 흔든다.
const dogFrontTail = [
  [17, 9, "k"],
  [18, 9, "k"],
  [16, 10, "k"],
  [17, 10, "b"],
  [18, 10, "b"],
  [19, 10, "k"],
  [17, 11, "k"],
  [18, 11, "b"],
  [19, 11, "k"],
  [18, 12, "k"],
]
const dogFrontTailWag = [
  [18, 8, "k"],
  [19, 8, "k"],
  [16, 9, "k"],
  [18, 9, "b"],
  [19, 9, "b"],
  [20, 9, "k"],
  [18, 10, "k"],
  [19, 10, "b"],
  [20, 10, "k"],
  [19, 11, "k"],
]

const dogFrontFrames = [
  overlayPet(
    mirrorPet([
      "...k",
      "..kbk",
      "..kbbk",
      "..kbbbkk",
      ".kbbbbbb",
      ".kbbebbb",
      ".kbbbbll",
      "..kbblll",
      "...kbbln",
      "...kbbll",
      "..kbbbll",
      "..kbbbll",
      "..kbbbll",
      "..kbdbll",
      "..kbdblk",
      "..kkkkkk",
    ]),
    dogFrontTail,
  ),
  overlayPet(
    mirrorPet([
      "..k",
      "..kbk",
      "..kbbk",
      "..kbbbkk",
      ".kbbbbbb",
      ".kbbebbb",
      ".kbbbbll",
      "..kbblll",
      "...kbbln",
      "...kbbkm",
      "..kbbblk",
      "..kbbbll",
      "..kbbbll",
      "..kbdbll",
      "..kbdblk",
      "..kkkkkk",
    ]),
    [...dogFrontTailWag, [1, 6, "w"], [0, 8, "w"], [22, 6, "w"], [23, 8, "w"]],
  ),
]

// 고양이 꼬리(정면에서는 오른쪽 발 옆으로 감긴다)
const catFrontTail = [
  [17, 13, "k"],
  [18, 13, "k"],
  [19, 12, "k"],
  [17, 14, "s"],
  [18, 14, "b"],
  [19, 14, "k"],
  [19, 13, "b"],
  [20, 12, "k"],
  [20, 13, "k"],
]

const catFrontFrames = [
  overlayPet(
    mirrorPet([
      "..k",
      "..kk",
      "..kbk",
      "..kbbkkk",
      ".kbbbbsb",
      ".kbbebbb",
      ".kbbbbbn",
      "..kbblll",
      "...kklll",
      "...kbsll",
      "..kbbsll",
      "..kbbbll",
      "..kbsbll",
      "..kbbblk",
      "..kbbblk",
      "..kkkkkk",
    ]),
    catFrontTail,
  ),
  overlayPet(
    mirrorPet([
      "..k",
      "..kk",
      "..kbk",
      "..kbbkkk",
      ".kbbbbsb",
      ".kbbebbb",
      ".kbbbbbn",
      "..kbblkm",
      "...kklll",
      "...kbsll",
      "..kbbsll",
      "..kbbbll",
      "..kbsbll",
      "..kbbblk",
      "..kbbblk",
      "..kkkkkk",
    ]),
    [...catFrontTail, [1, 5, "w"], [0, 7, "w"], [22, 5, "w"], [23, 7, "w"]],
  ),
]

// 동물 종류별 그림과 색. scene.json의 petKinds 순서가 스프라이트 시트의 행 순서다.
const pets = {
  hwanggu: {
    frames: [...dogFrames, ...dogFrontFrames],
    legend: {
      k: "#4A2E1A",
      b: "#D99A4E",
      l: "#F6D6A6",
      d: "#A8682E",
      e: "#2A1A10",
      n: "#2A1A10",
    },
  },
  baekgu: {
    frames: [...dogFrames, ...dogFrontFrames],
    legend: {
      k: "#5A5048",
      b: "#F4F0E6",
      l: "#FFFFFF",
      d: "#CFC6B5",
      e: "#2A2420",
      n: "#2A2420",
    },
  },
  cheese: {
    frames: [...catFrames, ...catFrontFrames],
    legend: {
      k: "#5A3418",
      b: "#F0A040",
      s: "#C8742A",
      l: "#FFF0D6",
      e: "#2A1A10",
      n: "#E07878",
    },
  },
  godeungeo: {
    frames: [...catFrames, ...catFrontFrames],
    legend: {
      k: "#2E2A26",
      b: "#9A9488",
      s: "#4E4A44",
      l: "#F4F1EA",
      e: "#2A2420",
      n: "#E07878",
    },
  },
}

// 벌린 입(m)과 소리 표시(w)는 모든 동물이 같은 색을 쓴다.
const petCommonLegend = { m: "#B8423A", w: color.white }

const patterns = `
<pattern id="grass" width="32" height="32" patternUnits="userSpaceOnUse">
  <rect width="32" height="32" fill="${color.grass}"/>
  ${gridToPaths(
    [
      "................................",
      ".............h..................",
      "................................",
      "...g.g..................h.......",
      "....g...........................",
      "............................g.g.",
      ".............................g..",
      "................................",
      "........h.......................",
      "................................",
      "..................g.g...........",
      "...................g............",
      "................................",
      "................................",
      ".....h..........................",
      "................................",
      "..........................h.....",
      "................................",
      ".g.g............................",
      "..g.............................",
      ".............g.g................",
      "..............g.................",
      "................................",
      "...........................g.g..",
      "............................g...",
      "................................",
      ".......g.g......................",
      "........g............h..........",
      "................................",
      "................................",
      "................................",
      "................................",
    ],
    { g: color.grassDark, h: color.grassLight },
  )}
</pattern>
<pattern id="tall-grass" width="16" height="16" patternUnits="userSpaceOnUse">
  <rect width="16" height="16" fill="${color.tallBase}"/>
  ${gridToPaths(
    [
      "..L.......L.....",
      ".LDL.....LDL..L.",
      "LD.DL...LD.DLLDL",
      "D...DL.LD...DD.D",
      ".....D.D........",
      "....L.......L...",
      "...LDL.....LDL..",
      "..LD.DL...LD.DL.",
      ".LD...DL.LD...DL",
      ".D.....D.D.....D",
      "L...........L...",
      "DL.........LDL..",
      ".DL.......LD.DL.",
      "..DL.....LD...DL",
      "...D.....D.....D",
      "................",
    ],
    { L: color.tallLight, D: color.tallDark },
  )}
</pattern>
<pattern id="path" width="16" height="16" patternUnits="userSpaceOnUse">
  <rect width="16" height="16" fill="${color.sand}"/>
  ${gridToPaths(
    [
      "................",
      "........l.......",
      "................",
      "................",
      "...dd...........",
      "...d............",
      "................",
      ".............l..",
      "................",
      "................",
      "...........dd...",
      "............d...",
      "................",
      "..l.............",
      "................",
      "................",
    ],
    { d: color.sandDark, l: color.sandLight },
  )}
</pattern>
<pattern id="water" width="32" height="16" patternUnits="userSpaceOnUse">
  <rect width="32" height="16" fill="${color.water}"/>
  ${gridToPaths(
    [
      "................................",
      "................................",
      "...llll.........................",
      "....dddd........................",
      "................................",
      "....................llll........",
      ".....................dddd.......",
      "................................",
      "................................",
      "..........llll..................",
      "...........dddd.................",
      "................................",
      "..........................lll...",
      "...........................ddd..",
      "................................",
      "................................",
    ],
    { l: color.waterLight, d: color.waterDeep },
  )}
</pattern>`

const symbols = [
  ...Object.entries(roofs).map(([name, roof]) =>
    symbol(
      `house-${name}`,
      80,
      64,
      gridToPaths(drawHouse(), houseLegend(roof)),
    ),
  ),
  symbol("tree", 16, 20, gridToPaths(tree, treeLegend)),
  symbol("fence", 16, 16, gridToPaths(drawFence(), fenceLegend)),
  symbol("flowers", 16, 16, gridToPaths(flowers, flowerLegend)),
  symbol("sign", 16, 16, gridToPaths(sign, signLegend)),
  symbol("lily", 8, 6, gridToPaths(lilyPad, lilyLegend)),
].join("")

// 길 가장자리: 길 타일 중 이웃이 길이 아닌 변에 1px 어두운 모래 선을 긋는다.
const pathTiles = new Set()
for (const { x, y, w, h } of scene.paths) {
  for (let ty = y; ty < y + h; ty++) {
    for (let tx = x; tx < x + w; tx++) pathTiles.add(`${tx},${ty}`)
  }
}
const isPath = (tx, ty) => pathTiles.has(`${tx},${ty}`)
let pathEdges = ""
for (const key of pathTiles) {
  const [tx, ty] = key.split(",").map(Number)
  const px = tx * T
  const py = ty * T
  if (!isPath(tx, ty - 1)) pathEdges += `M${px} ${py}h${T}v1h-${T}z`
  if (!isPath(tx, ty + 1)) pathEdges += `M${px} ${py + T - 1}h${T}v1h-${T}z`
  if (!isPath(tx - 1, ty)) pathEdges += `M${px} ${py}h1v${T}h-1z`
  if (!isPath(tx + 1, ty)) pathEdges += `M${px + T - 1} ${py}h1v${T}h-1z`
}

// 연못: 모서리를 계단식으로 깎은 둥근 사각형. 테두리 1px을 먼저 칠하고 안쪽을 물 무늬로 채운다.
const roundedRows = (x, y, width, height, radius) => {
  let d = ""
  for (let row = 0; row < height; row++) {
    const fromEdge = Math.min(row, height - 1 - row)
    const inset =
      fromEdge < radius
        ? radius -
          Math.floor(Math.sqrt(radius ** 2 - (radius - fromEdge - 0.5) ** 2))
        : 0
    const runWidth = width - inset * 2
    d += `M${x + inset} ${y + row}h${runWidth}v1h-${runWidth}z`
  }
  return d
}
const ponds = scene.ponds
  .map(({ x, y, w, h }, index) => {
    const px = x * T
    const py = y * T
    const width = w * T
    const height = h * T
    const lilies = [
      [px + 10 + index * 7, py + 12],
      [px + width - 22, py + height - 18 - index * 4],
    ]
      .map(([lx, ly]) => `<use href="#lily" x="${lx}" y="${ly}"/>`)
      .join("")
    return `<path fill="${color.waterRim}" d="${roundedRows(px, py, width, height, 8)}"/><path fill="url(#water)" d="${roundedRows(px + 1, py + 1, width - 2, height - 2, 7)}"/>${lilies}`
  })
  .join("")

const tallGrass = scene.tallGrass
  .map(
    ({ x, y, w, h }) =>
      `<rect x="${x * T}" y="${y * T}" width="${w * T}" height="${h * T}" fill="url(#tall-grass)"/>`,
  )
  .join("")

// 위에 있는 것부터 그려야 아래쪽 물체가 위쪽 물체를 자연스럽게 가린다.
const objects = [
  ...scene.fences.flatMap(({ x, y, length }) =>
    Array.from({ length }, (_, i) => ({ y, href: "fence", x: x + i })),
  ),
  ...scene.flowers.map(([x, y]) => ({ x, y, href: "flowers" })),
  ...scene.signs.map(([x, y]) => ({ x, y, href: "sign" })),
  ...scene.houses.map(({ x, y, roof }) => ({ x, y, href: `house-${roof}` })),
  ...scene.trees.map(([x, y]) => ({ x, y, href: "tree" })),
]
  .sort((a, b) => a.y - b.y)
  .map(({ x, y, href }) => `<use href="#${href}" x="${x * T}" y="${y * T}"/>`)
  .join("")

const width = scene.width * T
const height = scene.height * T
const mapSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" shape-rendering="crispEdges">
<!-- scripts/generate-desktop-map.mjs가 생성한 파일이다. 직접 고치지 말고 scene.json이나 생성 스크립트를 고친다. -->
<defs>${patterns}${symbols}</defs>
<rect width="${width}" height="${height}" fill="url(#grass)"/>
${scene.paths.map(({ x, y, w, h }) => `<rect x="${x * T}" y="${y * T}" width="${w * T}" height="${h * T}" fill="url(#path)"/>`).join("")}
<path fill="${color.sandDark}" d="${pathEdges}"/>
${ponds}
${tallGrass}
${objects}
</svg>
`

// 동물 스프라이트 시트: 가로는 프레임 4개(옆모습 가만히·짖기, 정면 가만히·짖기),
// 세로는 scene.petKinds 순서의 동물 종류.
const petSheetWidth = PET_WIDTH * 4
const petSheetHeight = PET_HEIGHT * scene.petKinds.length
const petSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${petSheetWidth} ${petSheetHeight}" width="${petSheetWidth}" height="${petSheetHeight}" shape-rendering="crispEdges">
<!-- scripts/generate-desktop-map.mjs가 생성한 파일이다. -->
${scene.petKinds
  .map((kind, row) => {
    const pet = pets[kind]
    if (!pet) throw new Error(`알 수 없는 동물 종류: ${kind}`)
    return pet.frames
      .map(
        (frame, col) =>
          `<g transform="translate(${col * PET_WIDTH} ${row * PET_HEIGHT})">${gridToPaths(frame, { ...pet.legend, ...petCommonLegend })}</g>`,
      )
      .join("")
  })
  .join("\n")}
</svg>
`

writeFileSync(resolve(root, "public/assets/desktop-map.svg"), mapSvg)
writeFileSync(resolve(root, "public/assets/map-pets.svg"), petSvg)
console.log(
  `desktop-map.svg ${(mapSvg.length / 1024).toFixed(1)}KB, map-pets.svg ${(petSvg.length / 1024).toFixed(1)}KB`,
)
