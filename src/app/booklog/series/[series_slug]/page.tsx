import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublishedSeries } from "@/domain/blog/server/public-readers"
import { BooklogSeriesDetailView } from "@/views/booklog-series-detail"

type BooklogSeriesPageProps = {
  params: Promise<{ series_slug: string }>
}

export async function generateMetadata({
  params,
}: BooklogSeriesPageProps): Promise<Metadata> {
  const { series_slug: seriesSlug } = await params
  const series = await getPublishedSeries(seriesSlug)

  if (!series) {
    return {
      title: "Series not found",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return {
    title: `${series.title} · Series`,
    description:
      series.description || `Read the ${series.title} booklog series in order.`,
  }
}

export default async function BooklogSeriesPage({
  params,
}: BooklogSeriesPageProps) {
  const { series_slug: seriesSlug } = await params
  const series = await getPublishedSeries(seriesSlug)

  if (!series) {
    notFound()
  }

  return <BooklogSeriesDetailView series={series} />
}
