import { neon } from "@neondatabase/serverless"
import { sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-http"
import { getServerEnv } from "@/core/env/server"
import * as schema from "./schema"

const connection = neon(getServerEnv().DATABASE_URL)

export const db = drizzle({ client: connection, schema })

export type Database = typeof db

export async function verifyDatabaseConnection() {
  await db.execute(sql`select 1`)
}
