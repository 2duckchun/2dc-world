import { z } from "zod"

export const seriesDeleteInputSchema = z.object({
  id: z.string().trim().min(1, "시리즈를 찾을 수 없습니다."),
})

export const seriesDeleteOutputSchema = z.object({
  id: z.string(),
  deletedPostCount: z.number().int().nonnegative(),
})

export type SeriesDeleteInput = z.input<typeof seriesDeleteInputSchema>
export type SeriesDeleteOutput = z.output<typeof seriesDeleteOutputSchema>
