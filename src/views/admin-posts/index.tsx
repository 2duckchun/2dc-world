import { PenLine } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/shared/ui/button"
import { AppRoutes } from "@/shared/utils/app-routes"
import { AdminPostsList } from "./components/admin-posts-list"

export function AdminPostsView() {
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
      <AdminPostsList />
    </div>
  )
}
