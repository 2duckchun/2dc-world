# 2dc-world 레트로 픽셀 리디자인 (Neo둥근모 + 절제된 8비트)

## Context

지금 블로그는 산만해 보입니다. 원인은 다음과 같습니다.
- 배경: 36px 격자선과 대각선 그라디언트를 겹친 `.blog-surface`
- 헤더: 반투명 + `backdrop-blur-xl`
- 카드: 모든 영역이 `rounded-lg border bg-card shadow-sm` 카드이고, 카드 안에 카드가 들어간 구조가 많음
- 로고: conic-gradient 링 아바타
- 장식: 등장 애니메이션, lucide 아이콘이 곳곳에 붙어 있음

이번 작업은 이 장식을 걷어내고 **둥근모꼴 + 절제된 8비트 + 깔끔한 단일 컬럼 레이아웃**으로 전면 교체하는 것입니다.

사용자와 확정한 결정:
| 항목 | 결정 |
|---|---|
| 폰트 범위 | 전부 Neo둥근모. 본문, 제목, UI 모두 적용하고 코드는 Neo둥근모 Code |
| 팔레트 | 종이+잉크. 미색 배경, 먹색 텍스트, 포인트 1색(패미컴 레드 계열) |
| 배경 맵 (Step 3 리뷰 후 추가) | 창 바깥에 게임보이 어드밴스 RPG 필드 같은 알록달록한 마을 맵(집, 연못, 길, 가로수, 울타리, 풀숲, 꽃, 앉아 있는 강아지·고양이)을 깔고 화면에 고정한다. 그림은 직접 그린 원본 도트이며 실제 게임 에셋은 쓰지 않는다. 처음엔 옅은 풀숲 무늬만 깔았으나 "안 보이고 풀밖에 없다"는 피드백으로 바꿨다. 처음 넣은 걸어다니는 사람은 동물(황구·백구·치즈·고등어)로 바꿨다 |
| 장식 강도 | 절제된 8비트. 각진 모서리, 2px 테두리, 블러 없는 오프셋 그림자. hover 시 ▶ 커서 정도만 |
| 다크모드 | 라이트/다크 둘 다 유지하고 첫 화면 깜빡임(FOUC)도 함께 수정 |
| 배경 색 (Step 1 리뷰 후 추가) | 맵 위에 크림색 종이 박스(헤더·본문·푸터)를 띄운다. 글자는 항상 종이 박스 안에 둬서 가독성을 지킨다. 하늘색 → 진한 틸 → 블루 틸 단색 배경을 거쳐 맵으로 바뀌었다 |

확인된 제약 (출처: neodgm.dalgona.dev/guides, github.com/neodgm):
- Neo둥근모는 **16px 배수(16/32/48)에서만 선명**합니다. **굵게와 기울임은 쓰지 않도록** 권고합니다.
- 라이선스는 SIL OFL 1.1입니다. 폰트를 재배포할 때 라이선스 파일을 동봉해야 합니다.
- 웹폰트 파일 크기는 `neodgm.woff2` 44KB, `neodgm_code.woff2` 40KB입니다(jsDelivr `neodgm-webfont@1.601` 기준). 서브셋 없이 그대로 써도 됩니다.

## 디자인 시스템 (globals.css 기준)

**색 토큰.** 기존 shadcn 토큰 이름은 그대로 두고 값만 교체합니다. 기존 파일처럼 oklch로 작성합니다. 아래 hex 값은 목표치이고 브라우저에서 미세 조정합니다.

| 토큰 | Light | Dark |
|---|---|---|
| **desktop** (신규, 맵이 닿지 않는 가장자리 바탕) | #8ACD6E (맵 잔디색) | 밤 필터를 거친 잔디색 |
| **tag** / **tag-foreground** (신규, 태그 블록 배경 / 글자) | 연두 / 진한 초록 (대비 5.3:1) | 어두운 초록 / 연두 (대비 8.2:1) |
| background (창 안, 본문 바탕) | #F4F1E8 (종이) | #151514 |
| foreground / primary | #1C1B19 (먹) | #ECE6D6 |
| card | #FBF9F3 (불투명. 기존 86% 알파 제거) | #1D1D1B |
| muted / muted-foreground | #E8E3D6 / #6B665C | #272623 / #A29C8E |
| border (구분선, 입력창) | #CFC8B8 | #3A3833 |
| **point** (신규) | #C53A2A | #FF6B57 |
| ring | = point | = point |
| chart-1~5 (코드 하이라이트 전용) | 청록, 초록, 보라, 주황, 레드 계열의 차분한 레트로 톤 | 같은 계열의 밝은 톤 |

- `point` 토큰을 새로 추가하고 `@theme`에 `--color-point`로 매핑합니다. 쓰는 곳은 활성 메뉴, ▶ 커서, 링크 hover, `::selection`, 포커스 링입니다.
- `desktop` 토큰은 `body`와 맵 레이어 바탕에만 씁니다. shadcn 컴포넌트가 기대하는 `--background`는 박스 안 바탕(종이)으로 남겨 두어, 박스 안의 입력창·버튼 색이 바뀌지 않게 합니다.
- 맵 위에는 글자를 직접 올리지 않습니다. 헤더·본문·푸터 모두 `layoutPanelClassName`(종이 박스)을 씁니다.

**형태**
- `--radius: 0`으로 둡니다. 모든 `rounded-*`가 각지게 바뀌므로 shadcn primitive와 admin도 자동으로 따라옵니다.
- `@theme`에 `--shadow-pixel: 4px 4px 0 0 var(--shadow-color)`를 추가합니다. `--shadow-color`는 테마별로 정의합니다(라이트는 먹색, 다크는 데스크톱보다 어두운 남색).
  - 사용처는 버튼, 시리즈 카드, 썸네일 프레임처럼 "물체"인 요소로 한정합니다.
- 프레임은 `border-2 border-foreground`, 구분선은 `border-border`(1px)로 나눕니다.
- 배경 맵
  - 장면 배치는 `src/widgets/layouts/desktop-map/desktop-map-scene.json`(64x36 타일, 16px 타일)에 둡니다. `scripts/generate-desktop-map.mjs`가 이 JSON으로 `public/assets/desktop-map.svg`(맵)와 `public/assets/map-pets.svg`(동물 스프라이트 시트)를 만들고, `DesktopMap` 컴포넌트는 같은 JSON에서 동물 위치를 읽습니다. 시트의 행 순서는 JSON의 `petKinds` 하나로 정합니다. 배치를 바꾸면 스크립트를 다시 실행합니다.
  - 맵 SVG는 반복 무늬(잔디·풀숲·길·물)를 `<pattern>`, 반복 물체(집·나무·울타리·꽃·표지판)를 `<symbol>`로 정의해 57KB로 유지합니다.
  - 화면에서는 2배(2048x1152px)로 그리고 가운데 정렬합니다. 본문 창이 가운데를 덮으므로 볼거리는 장면 좌우에 둡니다. 1280px 화면 기준 창 좌우로 보이는 타일은 12~19, 45~52번입니다.
  - 동물은 맵 그림과 분리한 작은 요소로 두고 제자리에 앉아 있습니다. 자세는 옆모습(`right`/`left`, 왼쪽은 좌우 반전)과 정면(`front`) 두 가지이고, 정면 그림은 왼쪽 절반만 그려 거울 복사합니다. 스프라이트 시트는 가로 4프레임(옆모습 가만히·짖기, 정면 가만히·짖기)입니다. 평소엔 가만히 있다가 주기 끝 무렵 고개를 들고 입을 벌리는 프레임으로 두 번 바뀝니다(짖기·울기, 소리 표시 포함). 동물마다 주기와 시작 시점을 어긋나게 해 한꺼번에 짖지 않게 하고, `prefers-reduced-motion`이면 멈춥니다.
  - 다크 모드는 같은 맵에 `brightness(0.45) saturate(0.7)` 필터를 걸어 밤 장면으로 씁니다.
  - 맵이 본문보다 눈에 띄어 글이 묻힌다는 피드백으로, 맵 장면에 `blur(1px)`을 걸고 그 위에 종이색 막(`::after`, opacity 0.2)을 씌웁니다. 막은 `color-mix` 대신 `opacity`로 만들어, `color-mix` 미지원 브라우저용 대체 규칙이 불투명한 막으로 맵을 가리지 않게 합니다.
  - 스크롤 패럴랙스: CSS scroll-driven animation(`animation-timeline: scroll(root)`)으로 페이지 맨 위에서는 맵 위쪽, 맨 아래에서는 맵 아래쪽이 보이도록 진행률에 맞춰 맵을 올립니다. 이동 거리는 `맵 높이 - 화면 높이`(크기 컨테이너의 `100cqh`)이고, 화면이 맵보다 크면 0입니다. JS 없이 transform 계열(`translate`)만 바꿉니다.
    - 지원: Chrome·Edge 115+, Safari 26+. Firefox는 미리보기 버전만 지원해서(MDN browser-compat-data 기준) 고정 배경으로 남습니다. `@supports`로 감싸 깨지지 않게 합니다.
    - `prefers-reduced-motion: reduce`이면 끕니다.
  - iOS Safari가 `background-attachment: fixed`를 무시해서 `position: fixed` 레이어로 구현합니다.
- 제거: `.blog-surface`, `.logo-mark`, `.animate-rise`, `@keyframes rise-in`, 모든 `backdrop-blur`와 반투명 배경, `shadow-sm` 계열

**타이포**
- `next/font/local`로 두 폰트를 로드하고 CSS 변수로 연결합니다.
  - `--font-sans`와 `--font-heading`에는 NeoDunggeunmo를 연결합니다.
  - `--font-mono`에는 NeoDunggeunmo Code를 연결합니다.
- `html`에 `font-synthesis: none`을 지정해 가짜 굵게와 가짜 기울임을 막습니다.
- **크기 단계를 3개로 제한합니다.** 별도 `@theme` 블록에서 필요 없는 기본 단계를 `initial`로 하나씩 지우고 세 단계만 남깁니다(`--text-*: initial` 한 줄 방식은 Biome 2.2 CSS 파서가 읽지 못함). 이름은 Tailwind 기본값과 같거나 가장 가까운 것을 써서 tailwind-merge가 그대로 인식하게 합니다.

  | 클래스 | 크기 | line-height |
  |---|---|---|
  | `text-base` | 16px | 1.75 |
  | `text-3xl` | 32px | 1.25 |
  | `text-5xl` | 48px | 7/6 |

  - 남아 있는 `text-sm`/`text-xs` 등은 CSS를 만들지 않으므로 16px을 상속합니다. 의도한 동작이며, 이유를 주석으로 남깁니다.
  - `button.tsx`의 `text-[0.8rem]` 같은 임의 크기는 제거합니다.
- 강조
  - `strong`: 굵게 대신 포인트색 15% 배경을 깔아 마커처럼 표시합니다.
  - `em`: 기울임 대신 포인트색으로 표시합니다.
  - 헤딩 위계는 크기, 색, ▶ 접두로 표현합니다.

**레이아웃**
- 공개 페이지는 단일 컬럼 `max-w-3xl`(768px)로 통일합니다. 헤더와 푸터의 내부 폭도 같은 값으로 맞춥니다.
- 맵 위에 헤더, 본문 창, 푸터를 같은 폭의 종이 박스(`border-2 border-foreground` + `shadow-pixel`)로 띄웁니다. 본문 창 안에서는 카드를 겹치지 않습니다.
- admin은 편집 화면 폭이 필요하므로 넓은 폭을 유지합니다. 아래 Step 2에서 route group을 분리합니다.

**아이콘**
- 공개 화면에서는 lucide 아이콘을 제거합니다. 텍스트와 ▶, `#` 글리프로 대체합니다.
- 꼭 필요한 해/달/하트 3개만 8×8 격자 SVG(`shape-rendering="crispEdges"`, `fill="currentColor"`)로 직접 그립니다. 파일은 `src/shared/ui/pixel-icon.tsx`입니다.
- admin 화면의 lucide 아이콘은 유지합니다.

## 구현 단계

작업 브랜치는 `feature/retro-redesign`입니다. 단계마다 리뷰 후 커밋합니다.

### Step 1. 기반: 폰트, 토큰, 테마 (이 단계만으로도 사이트 전체 인상이 바뀜)
- 폰트 파일 추가
  - `neodgm.woff2`, `neodgm_code.woff2`를 jsDelivr `neodgm-webfont@1.601`에서 받아 `src/app/fonts/`에 둡니다. 라이선스 원문 `OFL.txt`도 함께 둡니다.
  - 착수 전에 `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`를 다시 읽습니다(AGENTS.md 지시).
- `src/app/layout.tsx`
  - `localFont({ src, weight: "400", variable: "--font-neodgm" })`와 Code 폰트를 선언하고 두 variable 클래스를 `<html>`에 붙입니다.
- `src/app/globals.css`
  - 위 디자인 시스템 표대로 토큰, 타입 스케일, `--shadow-pixel`, `font-synthesis`, `::selection`을 적용합니다.
  - 장식 유틸리티를 삭제합니다.
  - `.prose-blog`를 재작성합니다.
    - typography 플러그인의 em 기반 크기(h1 2.25em, code .875em 등)를 16/32px로 덮어씁니다.
    - strong/em 규칙을 위 강조 방식으로 바꿉니다.
    - pre: 2px 프레임, 코드 배경색, Code 폰트를 적용합니다.
    - hljs 색은 새 chart 토큰을 그대로 쓰고, 기존 선택자 구조는 유지합니다.
  - `.admin-markdown-editor`는 토큰만 따라가게 둡니다.
- 테마: next-themes(이미 설치됨, 0.4.6)로 전환합니다. 라이브러리 표준 패턴이고 FOUC 방지 스크립트를 내장하고 있습니다.
  - 신규 `src/shared/ui/theme-provider.tsx`(client)를 만듭니다. 설정은 `attribute="class"`, `storageKey="2dc-world-theme"`(기존 사용자 설정 유지), `defaultTheme="system"`, `enableSystem`입니다.
  - 루트 레이아웃을 이 Provider로 감쌉니다.
  - `src/shared/ui/theme-toggle.tsx`를 `useTheme()`/`resolvedTheme` 기반으로 재작성하고 픽셀 해/달 아이콘을 씁니다.
  - 이렇게 하면 지금은 Provider 없이 동작하지 않는 `shared/ui/sonner.tsx`도 정상화됩니다.
  - **확인 필요**: React 19/Next 16에서 next-themes의 inline script 경고가 나는지 봅니다. 문제가 있으면 `<head>`에 직접 inline script를 넣는 방식으로 바꿉니다.
- `cspell.json`의 words에 `neodgm`, `Dunggeunmo`, `NeoDunggeunmo`를 추가합니다.

### Step 2. 레이아웃 셸: 데스크톱, 창, 헤더, 푸터, 폭
- `src/app/globals.css`: `--desktop` 토큰을 추가하고 `body` 바탕을 `bg-desktop`으로 바꿉니다.
- 신규 `src/widgets/layouts/layout-styles.ts`: 헤더·창·푸터가 공유하는 폭(`reading`/`wide`)과 좌우 여백, 데스크톱 위 텍스트 링크 스타일을 한곳에 둡니다.
- 신규 `src/widgets/layouts/site-layout.tsx`: 헤더, 창, 푸터를 조합합니다. 두 route group 레이아웃이 함께 씁니다.
- `src/widgets/layouts/main-header.tsx`: 정적 헤더로 바꿉니다(sticky 해제). 데스크톱 위에 바로 놓습니다.
  - 왼쪽: `2DC`(먹색 반전 블록) + `Tech Blog` 워드마크
  - 가운데/오른쪽: `POST · LOG · SERIES` 텍스트 내비, 테마 토글, `LOGIN` 또는 `@user · LOGOUT`
  - 모바일: 1행에 워드마크, 토글, 로그인을 두고 2행에 내비를 둡니다.
  - 반복되던 `border bg-background/75 shadow-sm backdrop-blur` 클래스 6개를 제거합니다.
- 신규 `src/widgets/layouts/main-nav.tsx`("use client")
  - `usePathname`으로 활성 메뉴에 `aria-current="page"`를 붙이고 포인트색과 ▶로 표시합니다.
  - 링크는 `AppRoutes`(`src/shared/utils/app-routes.ts`)를 재사용합니다.
- 관리자 링크(글 관리, 시리즈 관리, 새 글)는 admin에게만 보이는 얇은 먹색 반전 스트립으로 헤더 위에 분리합니다. 일반 방문자 헤더를 단순하게 유지하기 위해서입니다.
- `src/widgets/layouts/main-footer.tsx`: 데스크톱 위에 바로 놓고 폭을 헤더와 맞춥니다.
- `src/widgets/layouts/main-content.tsx`: 종이색 창을 그립니다. `width: "reading" | "wide"` prop을 받고 기본값은 reading(`max-w-3xl`)입니다.
- route group 분리
  - `git mv "src/app/(default)/admin" "src/app/(admin)/admin"`으로 옮깁니다. URL은 바뀌지 않습니다.
  - 신규 `src/app/(admin)/layout.tsx`는 `SiteLayout width="wide"`를 씁니다.
- `src/app/(default)/layout.tsx`: `SiteLayout`(reading 폭)을 씁니다.

### Step 3. 홈
- `src/views/home/sections/hero-section/index.tsx`
  - 아바타를 96px 정사각 2px 프레임에 넣습니다. 옆의 h1이 영역 이름이므로 `alt=""`로 두고, LCP 요소라 `preload`를 줍니다(Next 16에서 `priority`는 deprecated).
  - "Tech blog"를 48px로 키우고 깜빡이는 `_` 커서를 붙입니다(`prefers-reduced-motion`이면 정지).
  - GitHub/RSS는 `[GitHub] [RSS]` 텍스트 링크로 바꿉니다. 카피는 현행을 유지합니다.
  - 정리 대상: `widgets/brand/brand-mark.tsx`, `hero-section/components/icon-link-list.tsx`, `shared/lib/animation.ts`. 각각 사용처가 이 섹션과 explorer뿐인 것을 확인했고, 정리 후 삭제합니다.
- `home-content-explorer-section/components/*`
  - 바깥 카드를 제거합니다.
  - 탭: 밑줄만으로는 탭으로 보이지 않아서(Step 3 리뷰) 레트로 UI의 폴더 탭으로 바꿉니다. 2px 테두리 박스이고, 선택된 탭은 종이색으로 아래 선을 덮어 본문과 이어집니다. 모바일에서 한 줄에 들어가도록 좌우 여백을 `px-2 sm:px-3`로 둡니다.
  - 태그: 글자만으로는 날짜·종류와 섞여 보여서(Step 3 리뷰 피드백) 맵의 잔디와 같은 연두 블록 + 진한 초록 글자로 구분합니다. 필터 칩과 목록 안 태그가 같은 모양을 쓰도록 `src/shared/ui/tag-chip.tsx`(`TagLabel`, `TagFilterButton`)로 공용화합니다. 선택된 칩은 진한 초록 반전, hover는 2px 안쪽 테두리입니다. 칩 안 숫자를 흐리게 하면 대비가 3.9:1로 떨어져 글자와 같은 색으로 둡니다.
  - 리스트 행: 날짜(muted), 종류 `[LOG]`, 제목, 요약 순으로 둡니다. 행 사이는 1px 구분선이고, hover 시 제목 앞에 ▶가 나오고 제목이 포인트색으로 바뀝니다. `ArrowUpRight`와 `CalendarDays`는 제거합니다.
  - 시리즈 카드: 2px 프레임 + `shadow-pixel`, 썸네일도 프레임 안에 넣습니다. hover 시 제목이 밀리지 않도록 ▶ 없이 제목 색만 바꿉니다.
  - ▶ 커서 자리(왼쪽 1칸)는 hover가 있는 `sm` 이상에서만 둡니다. 모바일에서는 목록이 전체 폭을 씁니다.
  - 페이지네이션: `< 1 2 3 >` 텍스트로 바꾸고, 현재 페이지는 반전으로 표시합니다. 아이콘은 텍스트 글리프로 교체합니다(`src/shared/ui/pagination.tsx` 포함).

### Step 4. 목록과 시리즈 페이지
- `src/widgets/post/post-list.tsx`, `post-list-header.tsx`, `posts-archive.tsx`: 홈 리스트와 같은 행, 칩, 헤더 스타일로 맞춥니다. 카드와 아이콘 박스는 제거하고 h1은 32px로 둡니다.
- `src/views/series/index.tsx`, `src/views/series-detail/index.tsx`: 시리즈 카드와 헤더 프레임을 같은 규칙으로 맞춥니다.

### Step 5. 글 상세
- `src/views/post-detail/index.tsx`: 헤더와 본문 카드를 제거하고 종이 위에 바로 배치합니다.
  - 순서: 썸네일(2px 프레임, `alt=""` 유지), `[시리즈명]` 링크와 날짜, 제목(모바일 32px, sm 이상 48px), 요약
  - `prose-lg`를 제거합니다(16px 고정).
- `src/views/post-detail/sections/like-section.tsx`: 픽셀 하트(좋아요 시 포인트색으로 채움)와 숫자로 바꿉니다. 손으로 쓴 버튼 클래스 대신 `buttonVariants`를 재사용합니다.
- `comment-section`, `comment-form`, `comment-item`, `comment-list`: 카드를 제거하고 구분선 기반으로 바꿉니다. 버튼은 `buttonVariants`, 입력은 `shared/ui/textarea`를 재사용합니다.

### Step 6. 공용 primitive와 나머지 정리
- `src/shared/ui/button.tsx`
  - default/outline variant에 `border-2 border-foreground`와 `shadow-pixel`을 줍니다.
  - 눌렀을 때는 `translate-[2px]`와 함께 그림자를 없앱니다(`active:shadow-none`).
  - `text-[0.8rem]`과 `rounded-[min(...)]` 잔재를 정리합니다.
- `src/shared/ui/select.tsx`: popup의 `shadow-md`를 `shadow-pixel`로 바꿉니다.
- `src/views/privacy/index.tsx`, `src/app/forbidden.tsx`: 카드 스타일을 새 규칙으로 맞춥니다.
- 남은 `font-black`/`font-bold`/`font-semibold`/`font-medium` 클래스를 공개 화면에서 제거합니다. 굵기 축이 없는 폰트라 의미가 없는 클래스입니다.
- admin 화면은 토큰과 primitive 변경을 그대로 따라가게 둡니다. 깨진 곳만 손봅니다.

## 범위 밖 (후속 작업 후보)
- `/about`: `feature/about` 브랜치에만 있어서 이번 범위에서 뺍니다. 머지하면 토큰은 자동으로 따라오지만 react-pdf PDF는 따로 손봐야 합니다.
- 중복 컴포넌트 통합: `home-content-list`↔`post-list`, `home-tag-filter`↔`posts-archive` 필터, `home-series-list`↔`series` 카드. 이번에는 같은 스타일로 맞추기만 하고, 통합은 별도 작업으로 둡니다.
- 루트 레이아웃의 `@mdxeditor/editor/style.css` 전역 import(공개 페이지에도 로드됨), `not-found` 페이지 신설

## 검증
- 정적 검사: `pnpm typecheck`, `pnpm lint`, `pnpm spellcheck`, 마지막에 `pnpm build`
- 화면 확인: `pnpm dev`를 띄우고 라이트/다크, 375px/1280px 조합으로 아래 페이지를 봅니다.
  - `/`, `/?tab=series`, `/posts`, `/log`, `/series`, `/series/[s]`, `/posts/[slug]`(코드블록, 표, 이미지, 인용이 있는 글), `/privacy`
  - admin 페이지(`/admin/posts`, 편집기)는 로그인이 필요하므로 사용자가 직접 확인합니다.
- 픽셀 선명도 점검: DevTools 콘솔에서 아래 스니펫을 실행합니다. 텍스트를 가진 요소 중 computed font-size가 16/32/48px이 아닌 것을 찾아내며, 결과가 0건이어야 합니다.
  ```js
  [...document.querySelectorAll("body *")].filter(e=>[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())).map(e=>[e,getComputedStyle(e).fontSize]).filter(([,s])=>!["16px","32px","48px"].includes(s))
  ```
- 다크 모드: 다크 설정 상태에서 새로고침했을 때 라이트 화면이 깜빡이지 않아야 합니다. 기존 localStorage 값도 유지되어야 합니다.
- 폰트: Network 탭에서 woff2 두 개가 preload되는지 확인합니다. 브라우저 확대가 100%가 아니면 흐려지는 것은 폰트 특성상 피할 수 없습니다.
- 글리프: ▶와 `#`가 Neo둥근모에 있는지 확인합니다. 없으면 픽셀 SVG로 대체합니다.
