import { z } from "zod"

const serverEnvSchema = z.object({
  DATABASE_URL: z.url(),
  AUTH_SECRET: z.string().min(1),
  AUTH_GITHUB_ID: z.string().min(1),
  AUTH_GITHUB_SECRET: z.string().min(1),
  OWNER_GITHUB_ID: z.string().min(1),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .optional()
    .default("development"),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

let cachedEnv: ServerEnv | undefined

export function getServerEnv() {
  cachedEnv ??= serverEnvSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    OWNER_GITHUB_ID: process.env.OWNER_GITHUB_ID,
    NODE_ENV: process.env.NODE_ENV,
  })

  return cachedEnv
}
