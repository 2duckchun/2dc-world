type EmptyStateProps = {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-center shadow-sm">
      <div className="mx-auto max-w-2xl space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
    </section>
  )
}
