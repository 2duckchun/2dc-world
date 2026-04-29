import type { Metadata } from "next"
import { forbidden } from "next/navigation"
import { auth } from "@/auth"
import { trpcServerCaller } from "@/core/trpc/server/trpc-server-caller"
import { AdminPostsView } from "@/views/admin-posts"

export const metadata: Metadata = {
  title: "게시글 관리",
}

export default async function AdminPostsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    forbidden()
  }

  const caller = await trpcServerCaller()
  const posts = await caller.post.listForAdmin()

  return <AdminPostsView posts={posts} />
}
