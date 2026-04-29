import { z } from "zod"
import {
  postCreatePostOutputSchema,
  postEditorInputShape,
  validatePostSeriesFields,
} from "../post-create-post/schema"

export const postUpdatePostInputSchema = z
  .object({
    id: z.string().trim().min(1, "게시글을 찾을 수 없습니다."),
    ...postEditorInputShape,
  })
  .superRefine(validatePostSeriesFields)

export const postUpdatePostOutputSchema = postCreatePostOutputSchema

export type PostUpdatePostInput = z.input<typeof postUpdatePostInputSchema>
export type PostUpdatePostOutput = z.output<typeof postUpdatePostOutputSchema>
