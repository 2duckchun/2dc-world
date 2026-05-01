import { PostAdminHeader } from "@/widgets/post/post-admin-header"
import { PostEditFormContent } from "./sections/post-edit-form-content"

type AdminPostEditViewProps = {
  postId: string
}

export function AdminPostEditView({ postId }: AdminPostEditViewProps) {
  return (
    <div className="grid w-full gap-6">
      <PostAdminHeader title="게시글 수정" />
      <PostEditFormContent postId={postId} />
    </div>
  )
}
