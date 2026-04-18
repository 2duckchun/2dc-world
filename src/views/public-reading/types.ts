import type {
  PublishedPostDetail,
  PublishedPostSummary,
  PublishedSeriesDetail,
  PublishedSeriesSummary,
  TagResults,
} from "@/domain/blog/lib/contracts"

export type ReadingListViewProps = {
  collection: "blog" | "memo" | "booklog"
  title: string
  description: string
  items: PublishedPostSummary[]
  series?: PublishedSeriesSummary[]
}

export type ReadingDetailViewProps = {
  item: PublishedPostDetail
}

export type SeriesDetailViewProps = {
  series: PublishedSeriesDetail
}

export type TagResultsViewProps = {
  results: TagResults
}
