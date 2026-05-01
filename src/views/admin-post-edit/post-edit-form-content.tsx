"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import type { PostCreatePostInput } from "@/domain/post/procedure/post-create-post/schema"
import { PostEditorForm } from "@/views/admin-post-create/post-editor-form"

type PostEditFormContentProps = {
  postId: string
}

const getInitialValues = (post: PostCreatePostInput): PostCreatePostInput => ({
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

export function PostEditFormContent({ postId }: PostEditFormContentProps) {
  const trpc = useTRPC()
  const { data: post } = useSuspenseQuery(
    trpc.post.getForEdit.queryOptions({ id: postId }),
  )

  if (!post) {
    return null
  }

  return (
    <PostEditorForm
      mode="edit"
      postId={post.id}
      initialValues={getInitialValues(post)}
    />
  )
}
