import { Feed } from "feed"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/shared/utils/metadata"
import type { FeedItemInput } from "./types"

const MAX_ITEMS = 50

export const buildRssFeed = (items: FeedItemInput[]): string => {
  const sorted = items
    .slice()
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, MAX_ITEMS)

  const updated = sorted[0]?.publishedAt
  const currentYear = new Date().getFullYear()

  const feed = new Feed({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    id: SITE_URL,
    link: SITE_URL,
    language: "ko",
    copyright: `© ${currentYear} ${SITE_NAME}`,
    updated,
    feedLinks: {
      rss: `${SITE_URL}/rss.xml`,
    },
  })

  for (const item of sorted) {
    feed.addItem({
      title: item.title,
      id: item.link,
      link: item.link,
      date: item.publishedAt,
      description: item.description,
      category: item.categories?.map((name) => ({ name })),
    })
  }

  return feed.rss2()
}
