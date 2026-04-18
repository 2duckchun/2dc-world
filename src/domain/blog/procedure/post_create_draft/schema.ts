import { z } from "zod"
import { editablePostSchema, postTypeSchema } from "@/domain/blog/lib/contracts"

const seriesInputSchema = z.object({
  seriesId: z.string().min(1),
  orderIndex: z.number().int().positive(),
  chapterLabel: z.string().trim().min(1).nullable().optional(),
})

export const postCreateDraftInputSchema = z.object({
  type: postTypeSchema,
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1).nullable().optional(),
  summary: z.string().trim().min(1).nullable().optional(),
  contentMarkdown: z.string(),
  tagNames: z.array(z.string()).default([]),
  series: seriesInputSchema.nullable().default(null),
})

export const postCreateDraftOutputSchema = editablePostSchema

export type PostCreateDraftInput = z.infer<typeof postCreateDraftInputSchema>
export type PostCreateDraftOutput = z.infer<typeof postCreateDraftOutputSchema>
