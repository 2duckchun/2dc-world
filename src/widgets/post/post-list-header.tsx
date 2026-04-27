import type { LucideIcon } from "lucide-react"

type PostListHeaderProps = {
  icon: LucideIcon
  eyebrow: string
  title: string
  description: string
  meta: string
}

export const PostListHeader = ({
  icon: Icon,
  eyebrow,
  title,
  description,
  meta,
}: PostListHeaderProps) => {
  return (
    <header className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-7">
      <div className="flex items-center gap-3 text-muted-foreground text-sm">
        <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-background">
          <Icon className="size-4 text-chart-3" />
        </span>
        <span>{eyebrow}</span>
      </div>
      <div className="grid gap-3">
        <h1 className="text-balance font-black text-4xl leading-tight sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-3xl text-muted-foreground text-lg leading-8">
          {description}
        </p>
      </div>
      <p className="font-medium text-muted-foreground text-sm">{meta}</p>
    </header>
  )
}
