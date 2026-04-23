import {
  ArrowUpRight,
  BookOpenText,
  Braces,
  Clock3,
  Feather,
  GitBranch,
  Home,
  Layers3,
  LogIn,
  Mail,
  NotebookPen,
  Rss,
  Sparkles,
} from "lucide-react"
import type { CSSProperties } from "react"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"
import { ThemeToggle } from "./theme-toggle"

const links = [
  { label: "GitHub", icon: GitBranch, href: "https://github.com/" },
  { label: "Mail", icon: Mail, href: "mailto:hello@2dc.world" },
  { label: "RSS", icon: Rss, href: "/rss.xml" },
]

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
]

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
]

function animationDelay(value: number): CSSProperties {
  return { "--delay": `${value}ms` } as CSSProperties
}

export function HomeView() {
  return (
    <main className="blog-surface min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-border/70 border-b bg-background/78 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <a
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold"
          >
            <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-card shadow-sm transition-transform group-hover:-translate-y-0.5">
              <Home className="size-4" />
            </span>
            home
          </a>

          <nav className="flex items-center gap-2" aria-label="상단 메뉴">
            <ThemeToggle />
            <a
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "border border-border bg-background/75 shadow-sm backdrop-blur hover:bg-muted/80",
              )}
            >
              <LogIn data-icon="inline-start" className="size-4" />
              login
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-12">
        <section
          className="animate-rise grid items-center gap-6 md:grid-cols-[156px_1fr]"
          style={animationDelay(20)}
          aria-labelledby="blog-title"
        >
          <div className="logo-mark mx-auto flex size-36 items-center justify-center rounded-[999px] border border-border bg-card shadow-[0_18px_70px_color-mix(in_oklch,var(--foreground)_12%,transparent)] md:mx-0">
            <div className="flex size-24 items-center justify-center rounded-[999px] border border-background/70 bg-background/85 text-2xl font-black shadow-inner">
              2DC
            </div>
          </div>

          <div className="space-y-5 text-center md:text-left">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/75 px-3 py-1 text-muted-foreground text-sm shadow-sm">
                <Sparkles className="size-4 text-chart-2" />
                2DC
              </p>
              <div className="space-y-2">
                <h1
                  id="blog-title"
                  className="font-black text-4xl leading-tight sm:text-5xl"
                >
                  Tech blog
                </h1>
                <p className="max-w-2xl text-balance text-muted-foreground text-lg leading-8">
                  링크드인 아이콘, 깃헙 아이콘 등 필요한 채널을 정돈하고, 개발과
                  기록을 편안하게 이어가는 종합 블로그입니다.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {links.map((link) => {
                const Icon = link.icon

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "bg-card/75",
                    )}
                  >
                    <Icon data-icon="inline-start" className="size-4" />
                    {link.label}
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        <section
          className="story-rail animate-rise overflow-hidden rounded-lg border border-border bg-card shadow-sm"
          style={animationDelay(130)}
          aria-labelledby="latest-title"
        >
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-border border-b p-5 sm:p-7 lg:border-r lg:border-b-0">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">latest upload</p>
                  <h2 id="latest-title" className="mt-2 font-bold text-2xl">
                    최근에 올라온 글
                  </h2>
                </div>
                <a
                  href="/posts"
                  aria-label="최근 글 모두 보기"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon-lg",
                  })}
                >
                  <ArrowUpRight className="size-5" />
                </a>
              </div>

              <article className="space-y-5">
                <div className="flex w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 py-1 text-sm">
                  <Braces className="size-4 text-chart-1" />
                  Featured note
                </div>
                <h3 className="max-w-xl text-balance font-black text-3xl leading-tight sm:text-4xl">
                  만드는 사람의 속도로 정리하는 프론트엔드와 기록
                </h3>
                <p className="max-w-2xl text-muted-foreground leading-7">
                  최신 업로드 영역은 큼직하게, 아래 카테고리는 한눈에 들어오게
                  배치했습니다. 움직임은 진입감과 hover 피드백 정도로만 얹어
                  오래 머물러도 피곤하지 않게 잡았습니다.
                </p>
              </article>
            </div>

            <div className="divide-y divide-border/80">
              {latestUploads.map((post) => (
                <article
                  key={post.title}
                  className="group p-5 transition-colors hover:bg-muted/45 sm:p-7"
                >
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-lg bg-chart-2/12 px-2.5 py-1 font-medium text-chart-2">
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Clock3 className="size-4" />
                      {post.meta}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl leading-snug">
                        {post.title}
                      </h3>
                      <p className="max-w-xl text-muted-foreground leading-7">
                        {post.summary}
                      </p>
                    </div>
                    <ArrowUpRight className="mt-1 size-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3" aria-label="콘텐츠 묶음">
          {summaryCards.map((card, index) => {
            const Icon = card.icon

            return (
              <article
                key={card.title}
                className="animate-rise group flex min-h-72 flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-foreground/30 hover:shadow-[0_18px_55px_color-mix(in_oklch,var(--foreground)_9%,transparent)] sm:p-6"
                style={animationDelay(220 + index * 80)}
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-muted-foreground text-sm">
                      {card.title}
                    </p>
                    <h2 className="mt-2 font-bold text-2xl">{card.label}</h2>
                  </div>
                  <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-background transition-transform group-hover:-rotate-3 group-hover:scale-105">
                    <Icon className="size-5 text-chart-3" />
                  </span>
                </div>

                <p className="text-muted-foreground leading-7">
                  {card.description}
                </p>

                <div className="mt-auto pt-6">
                  <div className="mb-4 flex items-end justify-between border-border border-b pb-4">
                    <span className="font-black text-4xl">{card.count}</span>
                    <Feather className="mb-1 size-5 text-chart-4" />
                  </div>
                  <ul className="space-y-2 text-sm">
                    {card.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="text-muted-foreground">{item}</span>
                        <ArrowUpRight className="size-4 text-muted-foreground/70" />
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            )
          })}
        </section>
      </div>
    </main>
  )
}
