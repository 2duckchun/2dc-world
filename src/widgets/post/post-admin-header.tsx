import type { ReactNode } from "react"

type PostAdminHeaderProps = {
  title: string
  action?: ReactNode
}

export function PostAdminHeader({ title, action }: PostAdminHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="grid gap-2">
        <p className="font-semibold text-muted-foreground text-sm">Admin</p>
        <h1 className="font-black text-3xl leading-tight">{title}</h1>
      </div>
      {action}
    </header>
  )
}
