import type { ContentGetHomeContentOutput } from "./schema"

export const contentGetHomeContentFixture = {
  posts: [
    {
      id: "post_fixture_1",
      title: "First post",
      slug: "first-post",
      subtitle: "Example home content post.",
      publishedAt: new Date("2026-04-26T00:00:00.000Z"),
      createdAt: new Date("2026-04-26T00:00:00.000Z"),
      kind: "post",
      series: null,
      postTags: [
        {
          tag: {
            id: "tag_fixture_1",
            name: "Example tag",
            slug: "tag-example",
          },
        },
      ],
    },
  ],
  series: [
    {
      id: "series_fixture_1",
      title: "Example series",
      slug: "series-example",
      description: "Example home content series.",
      thumbnail: null,
      createdAt: new Date("2026-04-26T00:00:00.000Z"),
      updatedAt: new Date("2026-04-26T00:00:00.000Z"),
      posts: [
        {
          id: "series_post_fixture_1",
          title: "First series post",
          slug: "series-first-post",
          subtitle: null,
          publishedAt: new Date("2026-04-26T00:00:00.000Z"),
          createdAt: new Date("2026-04-26T00:00:00.000Z"),
          seriesOrder: 1,
        },
      ],
    },
  ],
} satisfies ContentGetHomeContentOutput
