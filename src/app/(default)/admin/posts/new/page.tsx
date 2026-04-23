import { asc } from "drizzle-orm"
import type { Metadata } from "next"
import { forbidden } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/core/db"
import { series } from "@/core/db/schema"
import { AdminPostCreateView } from "@/views/admin-post-create"

export const metadata: Metadata = {
  title: "새 글 작성",
}

export default async function AdminPostCreatePage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    forbidden()
  }

  const seriesOptions = await db.query.series.findMany({
    columns: {
      id: true,
      title: true,
    },
    orderBy: [asc(series.title)],
  })

  return <AdminPostCreateView seriesOptions={seriesOptions} />
}
