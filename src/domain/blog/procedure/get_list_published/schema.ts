import { z } from "zod"
import {
  postTypeSchema,
  publishedPostSummarySchema,
} from "@/domain/blog/lib/contracts"

export const getListPublishedInputSchema = z.object({
  type: postTypeSchema,
})

export const getListPublishedOutputSchema = z.array(publishedPostSummarySchema)

export type GetListPublishedInput = z.infer<typeof getListPublishedInputSchema>
export type GetListPublishedOutput = z.infer<
  typeof getListPublishedOutputSchema
>
