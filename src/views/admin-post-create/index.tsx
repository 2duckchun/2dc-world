import { PostEditorForm } from "@/views/admin-post-create/components/post-editor-form"

type SeriesOption = {
  id: string
  title: string
}

type AdminPostCreateViewProps = {
  seriesOptions: SeriesOption[]
}

export function AdminPostCreateView({
  seriesOptions,
}: AdminPostCreateViewProps) {
  return (
    <div className="grid w-full gap-6">
      <header className="grid gap-2">
        <p className="font-semibold text-muted-foreground text-sm">Admin</p>
        <h1 className="font-black text-3xl leading-tight">새 글 작성</h1>
      </header>
      <PostEditorForm mode="create" seriesOptions={seriesOptions} />
    </div>
  )
}
