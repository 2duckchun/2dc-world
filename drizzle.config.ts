import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { config as loadEnv } from "dotenv"
import { defineConfig } from "drizzle-kit"

const envFiles = [".env.local", ".env"]

for (const envFile of envFiles) {
  const envPath = resolve(process.cwd(), envFile)

  if (existsSync(envPath)) {
    loadEnv({ path: envPath, override: false })
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL for Drizzle Kit")
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/core/db/schema/*.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
})
