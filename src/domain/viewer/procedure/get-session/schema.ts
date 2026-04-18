import { z } from "zod"

export const viewerRoleSchema = z.enum(["anonymous", "authenticated", "owner"])

export const viewerUserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.email().nullable(),
  image: z.url().nullable(),
  githubAccountId: z.string().nullable(),
})

export const getSessionOutputSchema = z.object({
  role: viewerRoleSchema,
  isAuthenticated: z.boolean(),
  isOwner: z.boolean(),
  user: viewerUserSchema.nullable(),
})

export type GetSessionOutput = z.infer<typeof getSessionOutputSchema>
