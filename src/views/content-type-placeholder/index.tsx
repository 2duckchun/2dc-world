import Link from "next/link"

type ContentTypePlaceholderViewProps = {
  title: string
  description: string
}

export function ContentTypePlaceholderView({
  title,
  description,
}: ContentTypePlaceholderViewProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          Phase 0 placeholder
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-border px-5 py-4 text-sm leading-7 text-muted-foreground">
        Public list and detail experiences are planned for Phase 1. The route
        exists now so the app shell and navigation can stabilize without
        blocking future work.
      </div>

      <Link
        href="/"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Back to the Phase 0 overview
      </Link>
    </section>
  )
}
