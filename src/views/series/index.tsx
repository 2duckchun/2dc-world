import { ArrowUpRight, CalendarDays, Layers3 } from "lucide-react"
import Image from "next/image"
import { PostListHeader } from "@/widgets/post/post-list-header"

type SeriesArchiveItem = {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail: string | null
  createdAt: Date
  updatedAt: Date
  posts: readonly {
    id: string
    title: string
    slug: string
    publishedAt: Date | null
    createdAt: Date
    seriesOrder: number | null
  }[]
}

type SeriesViewProps = {
  series: readonly SeriesArchiveItem[]
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
})

const getSeriesDisplayDate = (series: SeriesArchiveItem) => {
  const latestPost = [...series.posts].sort(
    (firstPost, secondPost) =>
      (secondPost.publishedAt ?? secondPost.createdAt).getTime() -
      (firstPost.publishedAt ?? firstPost.createdAt).getTime(),
  )[0]

  return latestPost
    ? dateFormatter.format(latestPost.publishedAt ?? latestPost.createdAt)
    : dateFormatter.format(series.updatedAt)
}

export function SeriesView({ series }: SeriesViewProps) {
  return (
    <div className="grid w-full gap-6">
      <PostListHeader
        icon={Layers3}
        eyebrow="published series"
        title="Series"
        description="이어지는 주제를 회차 순서대로 읽을 수 있게 묶은 공개 시리즈입니다."
        meta={`공개된 시리즈 ${series.length.toLocaleString("ko-KR")}개`}
      />

      <section
        aria-label="공개 시리즈 목록"
        className="grid gap-4 md:grid-cols-2"
      >
        {series.length > 0 ? (
          series.map((seriesItem) => (
            <a
              key={seriesItem.id}
              href={`/series/${seriesItem.slug}`}
              className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-colors hover:bg-muted/35"
            >
              {seriesItem.thumbnail ? (
                <div className="relative aspect-[16/7] border-border border-b bg-muted">
                  <Image
                    src={seriesItem.thumbnail}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 528px, calc(100vw - 40px)"
                    className="object-cover"
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
                    {seriesItem.posts.length.toLocaleString("ko-KR")}회차
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4" />
                    {getSeriesDisplayDate(seriesItem)}
                  </span>
                </div>
              </article>
            </a>
          ))
        ) : (
          <div className="flex min-h-60 items-center rounded-lg border border-border bg-card p-5 text-muted-foreground shadow-sm sm:p-7 md:col-span-2">
            아직 공개된 시리즈가 없습니다.
          </div>
        )}
      </section>
    </div>
  )
}
