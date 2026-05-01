import { PostAdminHeader } from "@/widgets/post/post-admin-header"
import { PostEditorForm } from "@/widgets/post/post-editor-form"

export function AdminPostCreateView() {
  return (
    <div className="grid w-full gap-6">
      <PostAdminHeader title="새 글 작성" />
      <PostEditorForm mode="create" />
    </div>
  )
}
