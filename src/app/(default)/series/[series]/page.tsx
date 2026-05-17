import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublishedSeriesBySlug } from "@/domain/content/queries"
import { buildWebsiteMetadata } from "@/shared/utils/metadata"
import { SeriesDetailView } from "@/views/series-detail"

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

  return <SeriesDetailView series={series} />
}
