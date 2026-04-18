import { z } from "zod"
import { editablePostSchema } from "@/domain/blog/lib/contracts"

const seriesInputSchema = z.object({
  seriesId: z.string().min(1),
  orderIndex: z.number().int().positive(),
  chapterLabel: z.string().trim().min(1).nullable().optional(),
})

export const postUpdateDraftInputSchema = z.object({
  postId: z.string().min(1),
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1).nullable().optional(),
  summary: z.string().trim().min(1).nullable().optional(),
  contentMarkdown: z.string(),
  tagNames: z.array(z.string()).default([]),
  series: seriesInputSchema.nullable().default(null),
})

export const postUpdateDraftOutputSchema = editablePostSchema

export type PostUpdateDraftInput = z.infer<typeof postUpdateDraftInputSchema>
export type PostUpdateDraftOutput = z.infer<typeof postUpdateDraftOutputSchema>
