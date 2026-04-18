import { EmptyState } from "@/widgets/empty-state/empty-state"
import { PostCard } from "@/widgets/post-card/post-card"
import type { SeriesDetailViewProps } from "./types"

export function SeriesDetailView({ series }: SeriesDetailViewProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
          BOOKLOG SERIES
        </span>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {series.title}
          </h1>
          {series.description ? (
            <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {series.description}
            </p>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">
          {series.postCount} published entries in reading order.
        </p>
      </section>

      {series.items.length > 0 ? (
        <div className="grid gap-4">
          {series.items.map((item) => (
            <PostCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No published entries in this series yet"
          description="Once the owner publishes BOOKLOG entries for this series, they will appear here in order."
        />
      )}
    </div>
  )
}
