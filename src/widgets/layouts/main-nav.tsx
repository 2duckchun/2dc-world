"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/shared/lib/utils"
import { AppRoutes } from "@/shared/utils/app-routes"
import { desktopLinkClassName } from "@/widgets/layouts/layout-styles"

const navItems = [
  { label: "POST", href: AppRoutes.posts.list() },
  { label: "LOG", href: AppRoutes.log.list() },
  { label: "SERIES", href: AppRoutes.series.list() },
] as const

type MainNavProps = {
  className?: string
}

export const MainNav = ({ className }: MainNavProps) => {
  const pathname = usePathname()

  return (
    <nav aria-label="주요 메뉴" className={cn("flex items-center", className)}>
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              desktopLinkClassName,
              "group inline-flex items-center pr-4",
              isActive && "underline",
            )}
          >
            {/* 자리를 항상 차지하게 두어 커서가 나타나도 메뉴가 밀리지 않게 한다. */}
            <span
              aria-hidden="true"
              className={cn(
                "text-point",
                isActive ? "visible" : "invisible group-hover:visible",
              )}
            >
              ▶
            </span>
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}
