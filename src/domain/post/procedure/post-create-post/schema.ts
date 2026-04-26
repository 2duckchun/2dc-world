import { z } from "zod"
import { normalizeSlug, slugPattern } from "@/domain/content/slug"
import { postKindValues, postStatusValues } from "@/domain/content/types"

export const postCreatePostInputSchema = z
  .object({
    title: z.string().trim().min(1, "제목을 입력해 주세요."),
    slug: z
      .string()
      .transform(normalizeSlug)
      .pipe(
        z
          .string()
          .min(1, "슬러그를 입력해 주세요.")
          .regex(
            slugPattern,
            "슬러그는 영문, 숫자, 하이픈(-)만 사용할 수 있습니다.",
          ),
      ),
    subtitle: z.string().trim().nullable(),
    thumbnail: z.string().trim().nullable(),
    content: z.string().trim().min(1, "본문을 입력해 주세요."),
    kind: z.enum(postKindValues),
    status: z.enum(postStatusValues),
    seriesId: z.string().trim().nullable(),
    seriesOrder: z
      .number()
      .int()
      .min(1, "순서는 1 이상의 정수여야 합니다.")
      .nullable(),
  })
  .superRefine((input, ctx) => {
    const hasSeriesId = Boolean(input.seriesId)
    const hasSeriesOrder = input.seriesOrder !== null

    if (input.kind === "series" && (!hasSeriesId || !hasSeriesOrder)) {
      if (!hasSeriesId) {
        ctx.addIssue({
          code: "custom",
          message: "Series 글은 시리즈를 선택해야 합니다.",
          path: ["seriesId"],
        })
      }

      if (!hasSeriesOrder) {
        ctx.addIssue({
          code: "custom",
          message: "Series 글은 순서를 입력해야 합니다.",
          path: ["seriesOrder"],
        })
      }
    }

    if (hasSeriesId !== hasSeriesOrder) {
      const message = "시리즈와 순서는 함께 입력하거나 함께 비워두어야 합니다."

      ctx.addIssue({
        code: "custom",
        message,
        path: hasSeriesId ? ["seriesOrder"] : ["seriesId"],
      })
    }
  })

export const postCreatePostOutputSchema = z.object({
  id: z.string(),
  slug: z.string(),
})

export type PostCreatePostInput = z.input<typeof postCreatePostInputSchema>
export type PostCreatePostOutput = z.output<typeof postCreatePostOutputSchema>
