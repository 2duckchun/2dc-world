import Image from "next/image"
import Link from "next/link"
import type { HomeContentSeries } from "@/views/home/sections/home-content-explorer-section/components/home-content-explorer"

type HomeSeriesListProps = {
  series: readonly HomeContentSeries[]
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
})

export function HomeSeriesList({ series }: HomeSeriesListProps) {
  if (series.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        아직 공개된 시리즈가 없습니다.
      </p>
    )
  }

  return (
    <ul aria-label="홈 공개 시리즈 목록" className="grid gap-6 sm:grid-cols-2">
      {series.map((seriesItem) => (
        <li key={seriesItem.id}>
          <Link
            href={seriesItem.href}
            className="group flex h-full flex-col border-2 border-foreground bg-card shadow-pixel"
          >
            {seriesItem.thumbnail ? (
              <div className="relative aspect-video border-foreground border-b-2 bg-muted">
                <Image
                  src={seriesItem.thumbnail}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 320px, calc(100vw - 72px)"
                  className="object-contain p-4"
                  unoptimized
                />
              </div>
            ) : null}
            <article className="grid flex-1 content-start gap-2 p-4">
              <h3 className="group-hover:text-point">{seriesItem.title}</h3>
              <p className="text-muted-foreground">
                {seriesItem.description ?? "시리즈 설명이 준비 중입니다."}
              </p>
              <p className="flex flex-wrap gap-x-3 text-muted-foreground">
                <span>
                  {seriesItem.episodeCount.toLocaleString("ko-KR")}회차
                </span>
                <time dateTime={new Date(seriesItem.latestAt).toISOString()}>
                  {dateFormatter.format(new Date(seriesItem.latestAt))}
                </time>
              </p>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  )
}
