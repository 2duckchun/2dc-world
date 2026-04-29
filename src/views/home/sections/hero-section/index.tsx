import { GitBranch, Mail, Rss } from "lucide-react"
import { animationDelay } from "@/shared/lib/animation"
import {
  IconLinkList,
  type IconLinkListItem,
} from "@/views/home/sections/hero-section/components/icon-link-list"
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
          <div className="space-y-2">
            <h1
              id="blog-title"
              className="font-black text-4xl leading-tight sm:text-5xl"
            >
              Tech blog
            </h1>
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
