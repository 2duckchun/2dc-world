import { z } from "zod"
import { viewerRoleSchema } from "../get-session/schema"

export const getCapabilitiesOutputSchema = z.object({
  role: viewerRoleSchema,
  canInteract: z.boolean(),
  canLike: z.boolean(),
  canComment: z.boolean(),
  canReply: z.boolean(),
  canWrite: z.boolean(),
  canEdit: z.boolean(),
  canPublish: z.boolean(),
  canDeleteComment: z.boolean(),
})

export type GetCapabilitiesOutput = z.infer<typeof getCapabilitiesOutputSchema>
