import Image from "next/image"
import { AppRoutes } from "@/shared/utils/app-routes"

const links = [
  { label: "GitHub", href: "https://github.com/2duckchun" },
  { label: "RSS", href: AppRoutes.rss() },
] as const

export function HeroSection() {
  return (
    <section
      className="flex flex-col items-center gap-6 sm:flex-row"
      aria-labelledby="blog-title"
    >
      <div className="size-24 shrink-0 border-2 border-foreground bg-muted shadow-pixel">
        {/* 바로 옆 h1이 이 영역의 이름이므로 아바타는 장식 이미지로 둔다. */}
        <Image
          src="/assets/avatar.png"
          alt=""
          width={92}
          height={92}
          sizes="92px"
          preload
          className="size-full object-cover"
        />
      </div>
      <div className="grid gap-3 text-center sm:text-left">
        <h1 id="blog-title" className="text-5xl">
          Tech blog
          <span
            aria-hidden="true"
            className="animate-blink text-point motion-reduce:animate-none"
          >
            _
          </span>
        </h1>
        <p className="flex justify-center gap-4 sm:justify-start">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="decoration-2 decoration-point underline-offset-4 hover:text-point hover:underline"
            >
              <span aria-hidden="true">[</span>
              {link.label}
              <span aria-hidden="true">]</span>
            </a>
          ))}
        </p>
      </div>
    </section>
  )
}
