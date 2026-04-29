import { z } from "zod"
import { normalizeSlug, slugPattern } from "@/domain/content/slug"

export const seriesCreateInputSchema = z.object({
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
  description: z.string().trim().nullable(),
  thumbnail: z.string().trim().nullable(),
})

export const seriesCreateOutputSchema = z.object({
  id: z.string(),
  slug: z.string(),
})

export type SeriesCreateInput = z.input<typeof seriesCreateInputSchema>
export type SeriesCreateOutput = z.output<typeof seriesCreateOutputSchema>
