import { TRPCError } from "@trpc/server"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServerCaller } from "@/core/trpc/server"
import { SeriesDetailView } from "@/views/public-reading"

type SeriesPageProps = {
  params: Promise<{
    series_slug: string
  }>
}

async function getSeries(seriesSlug: string) {
  const caller = await getServerCaller()

  try {
    return await caller.blog.getSeriesBySlug({ seriesSlug })
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return null
    }

    throw error
  }
}

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  const { series_slug } = await params
  const series = await getSeries(series_slug)

  if (!series) {
    return {
      title: "Series not found | 2dc world",
    }
  }

  return {
    title: `${series.title} | 2dc world`,
    description:
      series.description ??
      `Read the BOOKLOG entries collected under ${series.title}.`,
  }
}

export default async function BooklogSeriesPage({ params }: SeriesPageProps) {
  const { series_slug } = await params
  const series = await getSeries(series_slug)

  if (!series) {
    notFound()
  }

  return <SeriesDetailView series={series} />
}
