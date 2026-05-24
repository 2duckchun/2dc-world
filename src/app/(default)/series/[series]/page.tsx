import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { getPublishedSeriesBySlug } from "@/domain/content/queries"
import { buildWebsiteMetadata } from "@/shared/utils/metadata"
import { SeriesDetailView } from "@/views/series-detail"
import { SeriesViewerAdminActions } from "@/widgets/series/series-viewer-admin-actions"

type SeriesDetailPageProps = {
  params: Promise<{
    series: string
  }>
}

export const generateMetadata = async ({
  params,
}: SeriesDetailPageProps): Promise<Metadata> => {
  const { series: seriesSlug } = await params
  const series = await getPublishedSeriesBySlug(seriesSlug)

  if (!series) {
    return {
      title: "시리즈를 찾을 수 없습니다",
    }
  }

  return buildWebsiteMetadata({
    title: series.title,
    description: series.description,
    thumbnail: series.thumbnail,
  })
}

export default async function SeriesDetailPage({
  params,
}: SeriesDetailPageProps) {
  const { series: seriesSlug } = await params
  const series = await getPublishedSeriesBySlug(seriesSlug)

  if (!series) {
    notFound()
  }

  const session = await auth()
  const isAdmin = session?.user?.role === "admin"

  return (
    <div className="grid w-full gap-3">
      {isAdmin && (
        <SeriesViewerAdminActions
          seriesId={series.id}
          episodeCount={series.posts.length}
        />
      )}
      <SeriesDetailView series={series} />
    </div>
  )
}
