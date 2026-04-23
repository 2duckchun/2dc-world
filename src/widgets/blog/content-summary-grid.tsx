import { ArrowUpRight, Feather, type LucideIcon } from "lucide-react"
import { animationDelay } from "@/shared/lib/animation"

export type ContentSummaryCard = {
  title: string
  label: string
  count: string
  icon: LucideIcon
  description: string
  items: readonly string[]
}

type ContentSummaryGridProps = {
  cards: readonly ContentSummaryCard[]
  ariaLabel: string
  initialDelay?: number
  delayStep?: number
}

export function ContentSummaryGrid({
  cards,
  ariaLabel,
  initialDelay = 0,
  delayStep = 0,
}: ContentSummaryGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3" aria-label={ariaLabel}>
      {cards.map((card, index) => {
        const Icon = card.icon

        return (
          <article
            key={card.title}
            className="animate-rise group flex min-h-72 flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-foreground/30 hover:shadow-[0_18px_55px_color-mix(in_oklch,var(--foreground)_9%,transparent)] sm:p-6"
            style={animationDelay(initialDelay + index * delayStep)}
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
  )
}
