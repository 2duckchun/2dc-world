import Image from "next/image"
import { cn } from "@/shared/lib/utils"

type BrandMarkProps = {
  label?: string
  className?: string
}

export function BrandMark({ label = "2DC", className }: BrandMarkProps) {
  return (
    <div
      className={cn(
        "logo-mark mx-auto flex size-36 items-center justify-center rounded-[999px] border border-border bg-card shadow-[0_18px_70px_color-mix(in_oklch,var(--foreground)_12%,transparent)] md:mx-0",
        className,
      )}
    >
      <div className="relative size-32 overflow-hidden rounded-[999px] border border-background/70 bg-background/85 shadow-inner">
        <Image
          src="/assets/avatar.png"
          alt={label}
          width={128}
          height={128}
          sizes="128px"
          className="size-full rounded-[999px] object-cover"
        />
      </div>
    </div>
  )
}
