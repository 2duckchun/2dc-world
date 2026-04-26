import { z } from "zod"
import { postKindValues } from "@/domain/content/types"

export const getLatestPostsInputSchema = z
  .object({
    limit: z.number().int().min(1).max(20).default(6),
  })
  .optional()
  .default({ limit: 6 })

export const getLatestPostsOutputSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    subtitle: z.string().nullable(),
    thumbnail: z.string().nullable(),
    kind: z.enum(postKindValues),
    publishedAt: z.date().nullable(),
    createdAt: z.date(),
  }),
)

export type GetLatestPostsInput = z.input<typeof getLatestPostsInputSchema>
export type GetLatestPostsOutput = z.output<typeof getLatestPostsOutputSchema>
