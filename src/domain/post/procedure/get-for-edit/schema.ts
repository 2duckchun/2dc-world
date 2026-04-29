import { z } from "zod"
import { postKindValues, postStatusValues } from "@/domain/content/types"

export const postGetForEditInputSchema = z.object({
  id: z.string().trim().min(1, "게시글을 찾을 수 없습니다."),
})

export const postGetForEditOutputSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    subtitle: z.string().nullable(),
    thumbnail: z.string().nullable(),
    content: z.string(),
    kind: z.enum(postKindValues),
    status: z.enum(postStatusValues),
    seriesId: z.string().nullable(),
    seriesOrder: z.number().nullable(),
    tags: z.array(z.string()),
    publishedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .nullable()

export type PostGetForEditInput = z.input<typeof postGetForEditInputSchema>
export type PostGetForEditOutput = z.output<typeof postGetForEditOutputSchema>
