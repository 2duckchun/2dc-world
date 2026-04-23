import { GitBranch, Mail, Rss, Sparkles } from "lucide-react"
import { animationDelay } from "@/shared/lib/animation"
import { IconLinkList, type IconLinkListItem } from "@/shared/ui/icon-link-list"
import { BrandMark } from "@/widgets/brand/brand-mark"

const links = [
  { label: "GitHub", icon: GitBranch, href: "https://github.com/" },
  { label: "Mail", icon: Mail, href: "mailto:hello@2dc.world" },
  { label: "RSS", icon: Rss, href: "/rss.xml" },
] satisfies readonly IconLinkListItem[]

export function HeroSection() {
  return (
    <section
      className="animate-rise grid items-center gap-6 md:grid-cols-[156px_1fr]"
      style={animationDelay(20)}
      aria-labelledby="blog-title"
    >
      <BrandMark />

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

        <IconLinkList
          links={links}
          className="justify-center md:justify-start"
          linkClassName="bg-card/75"
        />
      </div>
    </section>
  )
}
