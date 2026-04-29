import type { SeriesCreateInput, SeriesCreateOutput } from "./schema"

export const seriesCreateInputFixture = {
  title: "시리즈 예시",
  slug: "series-example",
  description: "시리즈 설명 예시입니다.",
  thumbnail: null,
} satisfies SeriesCreateInput

export const seriesCreateOutputFixture = {
  id: "series_fixture_1",
  slug: "series-example",
} satisfies SeriesCreateOutput
