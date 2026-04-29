import type { Metadata } from "next"
import { forbidden, notFound } from "next/navigation"
import { auth } from "@/auth"
import { trpcServerCaller } from "@/core/trpc/server/trpc-server-caller"
import { AdminPostEditView } from "@/views/admin-post-edit"

type AdminPostEditPageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: "게시글 수정",
}

export default async function AdminPostEditPage({
  params,
}: AdminPostEditPageProps) {
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    forbidden()
  }

  const { id } = await params
  const caller = await trpcServerCaller()
  const [post, seriesOptions] = await Promise.all([
    caller.post.getForEdit({ id }),
    caller.series.getOptions(),
  ])

  if (!post) {
    notFound()
  }

  return <AdminPostEditView post={post} seriesOptions={seriesOptions} />
}
