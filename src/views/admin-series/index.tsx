import { PenLine } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/shared/ui/button"
import { AppRoutes } from "@/shared/utils/app-routes"
import { PostAdminHeader } from "@/widgets/post/post-admin-header"
import { SeriesEditAndCreateSection } from "./sections"

export function AdminSeriesView() {
  return (
    <div className="grid w-full gap-6">
      <PostAdminHeader
        title="시리즈 관리"
        action={
          <Link
            href={AppRoutes.admin.posts.new()}
            className={buttonVariants({ variant: "outline" })}
          >
            <PenLine data-icon="inline-start" className="size-4" />새 글 작성
          </Link>
        }
      />

      <SeriesEditAndCreateSection />
    </div>
  )
}
