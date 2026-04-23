import { existsSync } from "node:fs"
import { loadEnvFile } from "node:process"
import { defineConfig } from "drizzle-kit"

if (!process.env.DATABASE_URL && existsSync(".env.local")) {
  loadEnvFile(".env.local")
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for Drizzle Kit")
}

export default defineConfig({
  schema: "./src/core/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
})
