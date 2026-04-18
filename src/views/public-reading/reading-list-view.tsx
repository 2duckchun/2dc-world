import { EmptyState } from "@/widgets/empty-state/empty-state"
import { PostCard } from "@/widgets/post-card/post-card"
import { SeriesList } from "@/widgets/series-list/series-list"
import type { ReadingListViewProps } from "./types"

export function ReadingListView({
  collection,
  title,
  description,
  items,
  series = [],
}: ReadingListViewProps) {
  const hasSeries = collection === "booklog" && series.length > 0

  return (
    <div className="space-y-8">
      <section className="space-y-3 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
          {collection.toUpperCase()}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      </section>

      {hasSeries ? (
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Series</h2>
            <p className="text-sm text-muted-foreground">
              Explore ordered reading paths before diving into individual
              entries.
            </p>
          </div>
          <SeriesList items={series} />
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {collection === "booklog" ? "Latest entries" : "Latest posts"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Published items are listed from newest to oldest.
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-4">
            {items.map((item) => (
              <PostCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={`No ${collection} posts yet`}
            description="Published entries will appear here once the owner finishes authoring and publishing them."
          />
        )}
      </section>
    </div>
  )
}
