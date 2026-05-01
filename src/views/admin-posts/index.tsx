import { PenLine } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/shared/ui/button"
import { AppRoutes } from "@/shared/utils/app-routes"
import { PostAdminHeader } from "@/widgets/post/post-admin-header"
import { AdminPostsList } from "./sections/admin-posts-list"

export function AdminPostsView() {
  return (
    <div className="grid w-full gap-6">
      <PostAdminHeader
        title="게시글 관리"
        action={
          <Link
            href={AppRoutes.admin.posts.new()}
            className={buttonVariants({ variant: "outline" })}
          >
            <PenLine data-icon="inline-start" className="size-4" />새 글 작성
          </Link>
        }
      />
      <AdminPostsList />
    </div>
  )
}
