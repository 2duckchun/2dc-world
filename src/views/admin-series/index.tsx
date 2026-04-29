import { PenLine } from "lucide-react"
import type { SeriesListOutput } from "@/domain/series/procedure/get-list/schema"
import { buttonVariants } from "@/shared/ui/button"
import { AdminSeriesManager } from "./components/admin-series-manager"

type AdminSeriesViewProps = {
  series: SeriesListOutput
}

export function AdminSeriesView({ series }: AdminSeriesViewProps) {
  return (
    <div className="grid w-full gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-2">
          <p className="font-semibold text-muted-foreground text-sm">Admin</p>
          <h1 className="font-black text-3xl leading-tight">시리즈 관리</h1>
        </div>
        <a
          href="/admin/posts/new"
          className={buttonVariants({ variant: "outline" })}
        >
          <PenLine data-icon="inline-start" className="size-4" />새 글 작성
        </a>
      </header>

      <AdminSeriesManager series={series} />
    </div>
  )
}
