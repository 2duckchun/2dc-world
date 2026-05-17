import type { Metadata } from "next"

export const SITE_NAME = "2DC Tech Blog"

type BaseMetadataInput = {
  title: string
  description?: string | null
  thumbnail?: string | null
}

type ArticleMetadataInput = BaseMetadataInput & {
  publishedTime: Date
}

const toMetadata = (
  input: BaseMetadataInput,
  og: { type: "article" | "website"; publishedTime?: string },
): Metadata => {
  const description = input.description ?? undefined
  const images = input.thumbnail ? [input.thumbnail] : undefined

  return {
    title: input.title,
    description,
    openGraph: {
      type: og.type,
      title: input.title,
      description,
      siteName: SITE_NAME,
      publishedTime: og.publishedTime,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: input.title,
      description,
      images,
    },
  }
}

// 자기완결 글(post/log/series 회차)용. og:type=article + article:published_time 노출.
export const buildArticleMetadata = (input: ArticleMetadataInput): Metadata =>
  toMetadata(input, {
    type: "article",
    publishedTime: input.publishedTime.toISOString(),
  })

// 단일 글이 아닌 허브/인덱스 페이지(예: 시리즈 상세)용. og:type=website.
export const buildWebsiteMetadata = (input: BaseMetadataInput): Metadata =>
  toMetadata(input, { type: "website" })
