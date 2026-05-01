import { PenLine } from "lucide-react"
import Link from "next/link"
import type { PostListForAdminOutput } from "@/domain/post/procedure/get-list-for-admin/schema"
import { buttonVariants } from "@/shared/ui/button"
import { AppRoutes } from "@/shared/utils/app-routes"
import { AdminPostsList } from "./components/admin-posts-list"

type AdminPostsViewProps = {
  posts: PostListForAdminOutput
}

export function AdminPostsView({ posts }: AdminPostsViewProps) {
  return (
    <div className="grid w-full gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-2">
          <p className="font-semibold text-muted-foreground text-sm">Admin</p>
          <h1 className="font-black text-3xl leading-tight">게시글 관리</h1>
        </div>
        <Link
          href={AppRoutes.admin.posts.new()}
          className={buttonVariants({ variant: "outline" })}
        >
          <PenLine data-icon="inline-start" className="size-4" />새 글 작성
        </Link>
      </header>

      <AdminPostsList posts={posts} />
    </div>
  )
}
