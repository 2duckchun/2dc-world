import { z } from "zod"
import { tagResultsSchema } from "@/domain/blog/lib/contracts"

export const getByTagInputSchema = z.object({
  tagName: z.string().min(1),
})

export const getByTagOutputSchema = tagResultsSchema

export type GetByTagInput = z.infer<typeof getByTagInputSchema>
export type GetByTagOutput = z.infer<typeof getByTagOutputSchema>
