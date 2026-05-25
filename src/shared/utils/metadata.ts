import type { Metadata } from "next"

export const SITE_NAME = "2DC Tech Blog"

export const SITE_URL = "https://blog.2duckchun.com"

export const SITE_DESCRIPTION =
  "2DC가 쓰는 기술 블로그. 깊이 있는 글, 일상적인 개발 로그, 연재 시리즈로 학습과 경험을 기록합니다."

export const NAVER_SITE_VERIFICATION =
  "5da2532700825226e569779beb872ba677c13472"

export const GTM_CONTAINER_ID = "GTM-N42DW84B"

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
