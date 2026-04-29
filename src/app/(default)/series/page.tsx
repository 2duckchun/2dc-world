import type { Metadata } from "next"
import { getPublishedSeriesArchive } from "@/domain/content/queries"
import { SeriesView } from "@/views/series"

export const metadata: Metadata = {
  title: "Series",
  description: "Published series from 2dc world.",
}

export default async function SeriesPage() {
  const series = await getPublishedSeriesArchive()

  return <SeriesView series={series} />
}
