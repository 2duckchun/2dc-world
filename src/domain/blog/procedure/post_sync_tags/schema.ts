import { z } from "zod"
import { syncTagsResultSchema } from "@/domain/blog/lib/contracts"

export const postSyncTagsInputSchema = z.object({
  postId: z.string().min(1),
  tagNames: z.array(z.string()).default([]),
})

export const postSyncTagsOutputSchema = syncTagsResultSchema

export type PostSyncTagsInput = z.infer<typeof postSyncTagsInputSchema>
export type PostSyncTagsOutput = z.infer<typeof postSyncTagsOutputSchema>
