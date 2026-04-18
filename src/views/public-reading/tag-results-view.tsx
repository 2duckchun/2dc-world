import { EmptyState } from "@/widgets/empty-state/empty-state"
import { PostCard } from "@/widgets/post-card/post-card"
import type { TagResultsViewProps } from "./types"

export function TagResultsView({ results }: TagResultsViewProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-3 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
          TAG
        </span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          #{results.tagName}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          Browse every published post currently connected to this tag.
        </p>
      </section>

      {results.items.length > 0 ? (
        <div className="grid gap-4">
          {results.items.map((item) => (
            <PostCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No published posts for this tag"
          description="Published content tagged with this label will appear here once it is available."
        />
      )}
    </div>
  )
}
