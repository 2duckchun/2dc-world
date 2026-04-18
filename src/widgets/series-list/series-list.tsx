import Link from "next/link"
import type { PublishedSeriesSummary } from "@/domain/blog/lib/contracts"
import { formatDateLabel } from "@/views/public-reading/lib/format"

type SeriesListProps = {
  items: PublishedSeriesSummary[]
}

export function SeriesList({ items }: SeriesListProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={item.href}
            className="flex h-full flex-col rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight">
                {item.title}
              </h2>
              {item.description ? (
                <p className="text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <span>{item.postCount} entries</span>
              {item.updatedAt
                ? ` · Updated ${formatDateLabel(item.updatedAt)}`
                : ""}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
