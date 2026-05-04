import Link from "next/link"
import { AppRoutes } from "@/shared/utils/app-routes"
import { SeriesEditForm } from "../existing-series-edit-form-section/series-edit-form"
import type { SeriesListItem } from "../shared/types"

export function SeriesEditCard({ series }: { series: SeriesListItem }) {
  return (
    <article className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h3 className="font-bold text-lg leading-tight">{series.title}</h3>
          <Link
            href={AppRoutes.series.detail(series.slug)}
            className="w-fit text-muted-foreground text-sm transition hover:text-foreground hover:underline"
          >
            /series/{series.slug}
          </Link>
        </div>
        <span className="rounded-lg border border-border bg-background px-2.5 py-1 font-medium text-muted-foreground text-sm">
          {series.episodeCount.toLocaleString("ko-KR")}회차
        </span>
      </div>
      <SeriesEditForm series={series} />
    </article>
  )
}
