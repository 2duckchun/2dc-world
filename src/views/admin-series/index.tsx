import { PenLine } from "lucide-react"
import type { SeriesListOutput } from "@/domain/series/procedure/get-list/schema"
import { buttonVariants } from "@/shared/ui/button"
import { PostAdminHeader } from "@/widgets/post/post-admin-header"
import { AdminSeriesManager } from "./components/admin-series-manager"

type AdminSeriesViewProps = {
  series: SeriesListOutput
}

export function AdminSeriesView({ series }: AdminSeriesViewProps) {
  return (
    <div className="grid w-full gap-6">
      <PostAdminHeader
        title="시리즈 관리"
        action={
          <a
            href="/admin/posts/new"
            className={buttonVariants({ variant: "outline" })}
          >
            <PenLine data-icon="inline-start" className="size-4" />새 글 작성
          </a>
        }
      />

      <AdminSeriesManager series={series} />
    </div>
  )
}
