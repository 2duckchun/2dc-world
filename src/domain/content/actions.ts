"use server"

import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/core/db"
import { posts, series } from "@/core/db/schema"
import { createSlug } from "@/domain/content/slug"
import {
  type PostKind,
  type PostStatus,
  postKindValues,
  postStatusValues,
} from "@/domain/content/types"

export type CreatePostState = {
  message: string
  status: "idle" | "error" | "success"
}

const getString = (formData: FormData, key: string) => {
  const value = formData.get(key)

  return typeof value === "string" ? value.trim() : ""
}

const isPostKind = (value: string): value is PostKind =>
  postKindValues.includes(value as PostKind)

const isPostStatus = (value: string): value is PostStatus =>
  postStatusValues.includes(value as PostStatus)

const parseSeriesOrder = (value: string) => {
  if (!value) {
    return null
  }

  const numberValue = Number(value)

  if (!Number.isInteger(numberValue) || numberValue < 1) {
    return undefined
  }

  return numberValue
}

export const createPostAction = async (
  _previousState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> => {
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    return {
      status: "error",
      message: "관리자만 게시글을 작성할 수 있습니다.",
    }
  }

  const title = getString(formData, "title")
  const subtitle = getString(formData, "subtitle")
  const thumbnail = getString(formData, "thumbnail")
  const content = getString(formData, "content")
  const requestedSlug = createSlug(getString(formData, "slug"))
  const kindValue = getString(formData, "kind")
  const statusValue = getString(formData, "status")
  const seriesId = getString(formData, "seriesId")
  const seriesOrder = parseSeriesOrder(getString(formData, "seriesOrder"))

  const kind = isPostKind(kindValue) ? kindValue : "post"
  const status = isPostStatus(statusValue) ? statusValue : "draft"
  const slug = requestedSlug || createSlug(title)

  if (!title || !slug || !content.trim()) {
    return {
      status: "error",
      message: "제목, 슬러그, 본문은 필수입니다.",
    }
  }

  if (seriesOrder === undefined) {
    return {
      status: "error",
      message: "시리즈 순서는 1 이상의 정수여야 합니다.",
    }
  }

  if (kind === "series" && (!seriesId || !seriesOrder)) {
    return {
      status: "error",
      message: "Series 글은 시리즈와 순서를 함께 선택해야 합니다.",
    }
  }

  if ((seriesId && !seriesOrder) || (!seriesId && seriesOrder)) {
    return {
      status: "error",
      message: "시리즈와 순서는 함께 입력하거나 함께 비워두어야 합니다.",
    }
  }

  const existingPost = await db.query.posts.findFirst({
    columns: { id: true },
    where: eq(posts.slug, slug),
  })

  if (existingPost) {
    return {
      status: "error",
      message: "이미 사용 중인 슬러그입니다.",
    }
  }

  if (seriesId) {
    const existingSeries = await db.query.series.findFirst({
      columns: { id: true },
      where: eq(series.id, seriesId),
    })

    if (!existingSeries) {
      return {
        status: "error",
        message: "선택한 시리즈를 찾을 수 없습니다.",
      }
    }
  }

  try {
    await db.insert(posts).values({
      title,
      slug,
      subtitle: subtitle || null,
      thumbnail: thumbnail || null,
      content,
      kind,
      status,
      authorId: session.user.id,
      seriesId: seriesId || null,
      seriesOrder,
      publishedAt: status === "published" ? new Date() : null,
      updatedAt: new Date(),
    })

    return {
      status: "success",
      message: "게시글을 저장했습니다.",
    }
  } catch {
    return {
      status: "error",
      message: "게시글 저장에 실패했습니다. 입력값을 다시 확인해 주세요.",
    }
  }
}
