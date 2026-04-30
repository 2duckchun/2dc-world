import type { PostGetForEditOutput } from "@/domain/post/procedure/get-for-edit/schema"
import type { PostCreatePostInput } from "@/domain/post/procedure/post-create-post/schema"
import { PostEditorForm } from "@/views/admin-post-create/post-editor-form"

type SeriesOption = {
  id: string
  title: string
}

type AdminPostEditViewProps = {
  post: NonNullable<PostGetForEditOutput>
  seriesOptions: SeriesOption[]
}

const getInitialValues = (
  post: NonNullable<PostGetForEditOutput>,
): PostCreatePostInput => ({
  title: post.title,
  slug: post.slug,
  subtitle: post.subtitle,
  thumbnail: post.thumbnail,
  content: post.content,
  kind: post.kind,
  status: post.status,
  seriesId: post.seriesId,
  seriesOrder: post.seriesOrder,
  tags: post.tags,
})

export function AdminPostEditView({
  post,
  seriesOptions,
}: AdminPostEditViewProps) {
  return (
    <div className="grid w-full gap-6">
      <header className="grid gap-2">
        <p className="font-semibold text-muted-foreground text-sm">Admin</p>
        <h1 className="font-black text-3xl leading-tight">게시글 수정</h1>
      </header>
      <PostEditorForm
        mode="edit"
        postId={post.id}
        initialValues={getInitialValues(post)}
        // seriesOptions={seriesOptions}
      />
    </div>
  )
}
