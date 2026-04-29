import { z } from "zod"
import {
  seriesCreateInputSchema,
  seriesCreateOutputSchema,
} from "../post-create-series/schema"

export const seriesUpdateInputSchema = seriesCreateInputSchema.extend({
  id: z.string().trim().min(1, "시리즈를 찾을 수 없습니다."),
})

export const seriesUpdateOutputSchema = seriesCreateOutputSchema

export type SeriesUpdateInput = z.input<typeof seriesUpdateInputSchema>
export type SeriesUpdateOutput = z.output<typeof seriesUpdateOutputSchema>
