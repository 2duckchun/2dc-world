import { z } from "zod"

export const postArchivePostInputSchema = z.object({
  id: z.string().trim().min(1, "게시글을 찾을 수 없습니다."),
})

export const postArchivePostOutputSchema = z.object({
  id: z.string(),
  status: z.literal("archived"),
})

export type PostArchivePostInput = z.input<typeof postArchivePostInputSchema>
export type PostArchivePostOutput = z.output<typeof postArchivePostOutputSchema>
