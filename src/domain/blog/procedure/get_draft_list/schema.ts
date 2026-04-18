import { z } from "zod"
import {
  draftListItemSchema,
  postTypeSchema,
} from "@/domain/blog/lib/contracts"

export const getDraftListInputSchema = z.object({
  type: postTypeSchema.optional(),
})

export const getDraftListOutputSchema = z.array(draftListItemSchema)

export type GetDraftListInput = z.infer<typeof getDraftListInputSchema>
export type GetDraftListOutput = z.infer<typeof getDraftListOutputSchema>
