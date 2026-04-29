import { z } from "zod"
import { postKindValues, postStatusValues } from "@/domain/content/types"

export const postListForAdminInputSchema = z.void()

export const postListForAdminOutputSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    kind: z.enum(postKindValues),
    status: z.enum(postStatusValues),
    seriesOrder: z.number().nullable(),
    publishedAt: z.date().nullable(),
    updatedAt: z.date(),
    series: z
      .object({
        title: z.string(),
        slug: z.string(),
      })
      .nullable(),
  }),
)

export type PostListForAdminOutput = z.output<
  typeof postListForAdminOutputSchema
>
