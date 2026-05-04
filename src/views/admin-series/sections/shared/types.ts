import type { SeriesListOutput } from "@/domain/series/procedure/get-list/schema"

export type SeriesListItem = Omit<
  SeriesListOutput[number],
  "createdAt" | "updatedAt"
> & {
  createdAt: Date | string
  updatedAt: Date | string
}
