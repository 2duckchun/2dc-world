import { PostEditFormContent } from "./post-edit-form-content"

type AdminPostEditViewProps = {
  postId: string
}

export function AdminPostEditView({ postId }: AdminPostEditViewProps) {
  return (
    <div className="grid w-full gap-6">
      <header className="grid gap-2">
        <p className="font-semibold text-muted-foreground text-sm">Admin</p>
        <h1 className="font-black text-3xl leading-tight">게시글 수정</h1>
      </header>
      <PostEditFormContent postId={postId} />
    </div>
  )
}
