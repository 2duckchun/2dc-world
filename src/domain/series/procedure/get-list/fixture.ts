import type { SeriesListOutput } from "./schema"

export const seriesListFixture = [
  {
    id: "series_fixture_1",
    title: "시리즈 예시",
    slug: "series-example",
    description: "시리즈 설명 예시입니다.",
    thumbnail: null,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    episodeCount: 3,
  },
] satisfies SeriesListOutput
