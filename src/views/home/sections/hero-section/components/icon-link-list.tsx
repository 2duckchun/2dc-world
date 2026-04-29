import type { LucideIcon } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"

export type IconLinkListItem = {
  label: string
  href: string
  icon: LucideIcon
}

type IconLinkListProps = {
  links: readonly IconLinkListItem[]
  className?: string
  linkClassName?: string
}

export function IconLinkList({
  links,
  className,
  linkClassName,
}: IconLinkListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {links.map((link) => {
        const Icon = link.icon

        return (
          <a
            key={link.label}
            href={link.href}
            className={cn(
              buttonVariants({ variant: "outline" }),
              linkClassName,
            )}
          >
            <Icon data-icon="inline-start" className="size-4" />
            {link.label}
          </a>
        )
      })}
    </div>
  )
}
