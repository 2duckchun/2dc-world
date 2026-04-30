import { PostEditorForm } from "./post-editor-form"

export function AdminPostCreateView() {
  return (
    <div className="grid w-full gap-6">
      <header className="grid gap-2">
        <p className="font-semibold text-muted-foreground text-sm">Admin</p>
        <h1 className="font-black text-3xl leading-tight">새 글 작성</h1>
      </header>
      <PostEditorForm mode="create" />
    </div>
  )
}
