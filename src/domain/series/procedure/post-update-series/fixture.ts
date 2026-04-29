import type { SeriesUpdateInput, SeriesUpdateOutput } from "./schema"

export const seriesUpdateInputFixture = {
  id: "series_fixture_1",
  title: "시리즈 예시 수정",
  slug: "series-example",
  description: "수정된 시리즈 설명 예시입니다.",
  thumbnail: null,
} satisfies SeriesUpdateInput

export const seriesUpdateOutputFixture = {
  id: "series_fixture_1",
  slug: "series-example",
} satisfies SeriesUpdateOutput
