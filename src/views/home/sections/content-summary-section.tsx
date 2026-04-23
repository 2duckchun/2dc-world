import { BookOpenText, Layers3, NotebookPen } from "lucide-react"
import {
  type ContentSummaryCard,
  ContentSummaryGrid,
} from "@/widgets/blog/content-summary-grid"

const summaryCards = [
  {
    title: "post",
    label: "전체 글",
    count: "128",
    icon: BookOpenText,
    description: "기술, 제품, 생활 기록을 한 곳에서 빠르게 훑습니다.",
    items: ["React와 RSC", "디자인 시스템", "작은 회고"],
  },
  {
    title: "log",
    label: "일상 로그",
    count: "42",
    icon: NotebookPen,
    description: "짧은 생각과 작업 노트를 가볍게 남기는 공간입니다.",
    items: ["오늘의 작업", "읽은 문장", "배운 점"],
  },
  {
    title: "series",
    label: "연재",
    count: "9",
    icon: Layers3,
    description: "길게 이어지는 주제를 묶어서 차분하게 따라갑니다.",
    items: ["블로그 만들기", "프론트엔드 노트", "2DC 월드"],
  },
] satisfies readonly ContentSummaryCard[]

export function ContentSummarySection() {
  return (
    <ContentSummaryGrid
      cards={summaryCards}
      ariaLabel="콘텐츠 묶음"
      initialDelay={220}
      delayStep={80}
    />
  )
}
