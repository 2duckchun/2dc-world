import { z } from "zod"

export const seriesGetOptionsInputSchema = z.void()

export const seriesGetOptionsOutputSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    // 새 회차 작성 시 순서 입력칸의 제안값 (기존 최대 순서 + 1)
    nextOrder: z.number().int().positive(),
  }),
)

export type SeriesGetOptionsOutput = z.output<
  typeof seriesGetOptionsOutputSchema
>
