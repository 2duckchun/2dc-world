import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"

type EmptyStateCardProps = {
  eyebrow: string
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
  className?: string
}

export function EmptyStateCard({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  className,
}: EmptyStateCardProps) {
  return (
    <section
      className={cn(
        "rounded-[2rem] border border-dashed border-border/80 bg-card/70 p-8 text-center shadow-sm",
        className,
      )}
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          <Sparkles className="size-3.5" />
          {eyebrow}
        </span>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-balance">
            {title}
          </h2>
          <p className="text-sm leading-7 text-muted-foreground text-pretty sm:text-base">
            {description}
          </p>
        </div>
        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full",
            )}
          >
            {actionLabel}
            <ArrowRight className="size-4" />
          </Link>
        ) : null}
      </div>
    </section>
  )
}
