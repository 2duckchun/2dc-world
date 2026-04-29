import { CalendarDays, Layers3 } from "lucide-react"
import Image from "next/image"
import { PostList, type PostListItem } from "@/widgets/post/post-list"

type SeriesDetail = {
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
    subtitle: string | null
    publishedAt: Date | null
    createdAt: Date
    seriesOrder: number | null
  }[]
}

type SeriesDetailViewProps = {
  series: SeriesDetail
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
})

const toPostListItem = (
  series: SeriesDetail,
  post: SeriesDetail["posts"][number],
): PostListItem => {
  const orderLabel =
    post.seriesOrder === null ? "회차" : `${post.seriesOrder}회차`

  return {
    id: post.id,
    title: post.title,
    href: `/series/${series.slug}/${post.slug}`,
    subtitle: post.subtitle ? `${orderLabel} · ${post.subtitle}` : orderLabel,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
  }
}

export function SeriesDetailView({ series }: SeriesDetailViewProps) {
  const displayDate = dateFormatter.format(series.updatedAt)
  const posts = series.posts.map((post) => toPostListItem(series, post))

  return (
    <div className="grid w-full gap-6">
      <header className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {series.thumbnail ? (
          <div className="relative aspect-[16/7] w-full border-border border-b bg-muted">
            <Image
              src={series.thumbnail}
              alt=""
              fill
              priority
              sizes="(min-width: 1152px) 1088px, calc(100vw - 40px)"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}

        <div className="grid gap-4 p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Layers3 className="size-4" />
              {series.posts.length.toLocaleString("ko-KR")}회차
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {displayDate}
            </span>
          </div>
          <div className="grid gap-3">
            <h1 className="text-balance font-black text-4xl leading-tight sm:text-5xl">
              {series.title}
            </h1>
            {series.description ? (
              <p className="max-w-3xl text-muted-foreground text-lg leading-8">
                {series.description}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <PostList
        posts={posts}
        ariaLabel={`${series.title} 회차 목록`}
        emptyMessage="아직 공개된 회차가 없습니다."
      />
    </div>
  )
}
