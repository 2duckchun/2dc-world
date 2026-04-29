import type { SeriesDeleteInput, SeriesDeleteOutput } from "./schema"

export const seriesDeleteInputFixture = {
  id: "series_fixture_1",
} satisfies SeriesDeleteInput

export const seriesDeleteOutputFixture = {
  id: "series_fixture_1",
  deletedPostCount: 3,
} satisfies SeriesDeleteOutput
