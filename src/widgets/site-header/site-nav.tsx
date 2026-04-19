"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/shared/lib/utils"

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/memo", label: "Memo" },
  { href: "/booklog", label: "Booklog" },
] as const

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary" className="flex flex-wrap items-center gap-2">
      {navigationItems.map((item) => {
        const active = isActive(pathname, item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
              active
                ? "border-primary/20 bg-primary/10 text-foreground shadow-sm"
                : "border-transparent text-muted-foreground hover:border-border/80 hover:bg-muted/70 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
