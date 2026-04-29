import { ArrowUpRight, CalendarDays, Layers3 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { HomeContentSeries } from "@/views/home/components/home-content-types"

type HomeSeriesListProps = {
  series: readonly HomeContentSeries[]
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
})

export function HomeSeriesList({ series }: HomeSeriesListProps) {
  return (
    <section aria-label="홈 공개 시리즈 목록">
      {series.length > 0 ? (
        <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2">
          {series.map((seriesItem) => (
            <Link
              key={seriesItem.id}
              href={seriesItem.href}
              className="group overflow-hidden rounded-lg border border-border bg-background transition-colors hover:bg-muted/45"
            >
              {seriesItem.thumbnail ? (
                <div className="relative aspect-[16/9] border-border border-b bg-muted">
                  <Image
                    src={seriesItem.thumbnail}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 496px, calc(100vw - 72px)"
                    className="object-contain p-4"
                    unoptimized
                  />
                </div>
              ) : null}
              <article className="grid gap-4 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid gap-2">
                    <h2 className="font-bold text-2xl leading-snug transition-colors group-hover:text-chart-3">
                      {seriesItem.title}
                    </h2>
                    <p className="text-muted-foreground leading-7">
                      {seriesItem.description ?? "시리즈 설명이 준비 중입니다."}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <Layers3 className="size-4" />
                    {seriesItem.episodeCount.toLocaleString("ko-KR")}회차
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4" />
                    {dateFormatter.format(new Date(seriesItem.latestAt))}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex min-h-72 items-center p-5 text-muted-foreground sm:p-7">
          아직 공개된 시리즈가 없습니다.
        </div>
      )}
    </section>
  )
}
