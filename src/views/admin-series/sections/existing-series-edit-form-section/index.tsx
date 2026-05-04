"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"

export const ExistingSeriesEditFormSections = () => {
  const trpc = useTRPC()
  const { data: series } = useSuspenseQuery(trpc.series.list.queryOptions())

  return (
    <section className="grid gap-4" aria-label="시리즈 목록">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-bold text-xl leading-tight">시리즈 목록</h2>
        <p className="text-muted-foreground text-sm">
          전체 {series.length.toLocaleString("ko-KR")}개
        </p>
      </div>

      {series.length > 0 ? (
        <div className="grid gap-4">
          {/* {series.map((seriesItem) => (
            <SeriesEditCard key={seriesItem.id} series={seriesItem} />
          ))} */}
        </div>
      ) : (
        <div className="flex min-h-36 items-center rounded-lg border border-border bg-card p-5 text-muted-foreground shadow-sm">
          아직 등록된 시리즈가 없습니다.
        </div>
      )}
    </section>
  )
}
