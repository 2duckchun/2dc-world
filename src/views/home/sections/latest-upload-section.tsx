import { animationDelay } from "@/shared/lib/animation"
import {
  type LatestUploadItem,
  LatestUploadPanel,
} from "@/widgets/blog/latest-upload-panel"

const latestUploads = [
  {
    title: "Next.js 16에서 App Router를 다시 정리하기",
    category: "Tech",
    summary:
      "라우팅, 서버 컴포넌트, 캐싱 흐름을 실제 블로그 구조에 맞춰 다시 훑어봅니다.",
    meta: "방금 전 · 8분 읽기",
  },
  {
    title: "아침 로그: 덜어낸 코드가 남긴 것",
    category: "Log",
    summary:
      "기록을 쌓는 법, 지우는 법, 그리고 오래 남겨도 부담 없는 문장에 관하여.",
    meta: "오늘 · 4분 읽기",
  },
] satisfies readonly LatestUploadItem[]

const featuredUpload = {
  label: "Featured note",
  title: "만드는 사람의 속도로 정리하는 프론트엔드와 기록",
  description:
    "최신 업로드 영역은 큼직하게, 아래 카테고리는 한눈에 들어오게 배치했습니다. 움직임은 진입감과 hover 피드백 정도로만 얹어 오래 머물러도 피곤하지 않게 잡았습니다.",
}

export function LatestUploadSection() {
  return (
    <LatestUploadPanel
      eyebrow="latest upload"
      title="최근에 올라온 글"
      titleId="home-latest-title"
      href="/posts"
      actionLabel="최근 글 모두 보기"
      featured={featuredUpload}
      posts={latestUploads}
      style={animationDelay(130)}
    />
  )
}
