import Link from "next/link"
import type { DraftListItem } from "@/domain/blog/lib/contracts"
import { postTypeToCollection } from "@/domain/blog/lib/model"
import { formatDateLabel } from "@/views/public-reading/lib/format"
import { EmptyState } from "@/widgets/empty-state/empty-state"

type DashboardViewProps = {
  drafts: DraftListItem[]
}

const createLinks = [
  { href: "/blog/new", label: "New BLOG" },
  { href: "/memo/new", label: "New MEMO" },
  { href: "/booklog/new", label: "New BOOKLOG" },
]

export function DashboardView({ drafts }: DashboardViewProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
          Owner authoring
        </span>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Manage drafts before they become public.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            Create new posts, continue unfinished drafts, and prepare content
            for publication without leaving the shared app shell.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {createLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Recent drafts
          </h2>
          <p className="text-sm text-muted-foreground">
            Drafts stay private until you publish them.
          </p>
        </div>

        {drafts.length > 0 ? (
          <div className="grid gap-4">
            {drafts.map((draft) => {
              const collection = postTypeToCollection(draft.type)
              const editHref = `/${collection}/${draft.slug}/edit`

              return (
                <Link
                  key={draft.id}
                  href={editHref}
                  className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {draft.type}
                      </span>
                      <span>{draft.status}</span>
                      <span>Updated {formatDateLabel(draft.updatedAt)}</span>
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {draft.title}
                    </h3>
                    {draft.summary ? (
                      <p className="text-sm leading-7 text-muted-foreground">
                        {draft.summary}
                      </p>
                    ) : null}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <EmptyState
            title="No drafts yet"
            description="Start with a new BLOG, MEMO, or BOOKLOG entry to begin the owner authoring flow."
          />
        )}
      </section>
    </div>
  )
}
