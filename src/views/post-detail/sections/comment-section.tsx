"use client"

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { TRPCClientError } from "@trpc/client"
import { useState } from "react"
import { signInWithGitHub } from "@/core/auth/actions"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { CommentForm } from "./comment-form"
import { CommentList, type OpenForm, type Pending } from "./comment-list"

type CommentSectionProps = {
  postId: string
  isAuthenticated: boolean
}

export function CommentSection({
  postId,
  isAuthenticated,
}: CommentSectionProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const queryOptions = trpc.comment.list.queryOptions({ postId })
  const { data: comments } = useSuspenseQuery(queryOptions)

  const [openForm, setOpenForm] = useState<OpenForm>(null)
  const [topLevelError, setTopLevelError] = useState<string | null>(null)
  const [inlineErrorByCommentId, setInlineErrorByCommentId] = useState<
    Record<string, string | null>
  >({})

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryOptions.queryKey })

  const errorMessageOf = (error: unknown) =>
    error instanceof TRPCClientError ? error.message : "요청에 실패했습니다."

  const setInlineError = (commentId: string, message: string | null) => {
    setInlineErrorByCommentId((current) => ({
      ...current,
      [commentId]: message,
    }))
  }

  const createMutation = useMutation(
    trpc.comment.create.mutationOptions({
      onSuccess: invalidate,
    }),
  )

  const updateMutation = useMutation(
    trpc.comment.update.mutationOptions({
      onSuccess: invalidate,
    }),
  )

  const softDeleteMutation = useMutation(
    trpc.comment.softDelete.mutationOptions({
      onSuccess: invalidate,
    }),
  )

  const pending: Pending = (() => {
    if (updateMutation.isPending && updateMutation.variables) {
      return { kind: "edit", id: updateMutation.variables.commentId }
    }
    if (softDeleteMutation.isPending && softDeleteMutation.variables) {
      return { kind: "delete", id: softDeleteMutation.variables.commentId }
    }
    if (createMutation.isPending && createMutation.variables?.parentCommentId) {
      return { kind: "reply", id: createMutation.variables.parentCommentId }
    }
    return null
  })()

  const topLevelPending =
    createMutation.isPending && !createMutation.variables?.parentCommentId

  const submitTopLevel = (body: string) => {
    setTopLevelError(null)
    createMutation.mutate(
      { postId, parentCommentId: null, body },
      {
        onSuccess: () => setTopLevelError(null),
        onError: (error) => setTopLevelError(errorMessageOf(error)),
      },
    )
  }

  const submitReply = (parentCommentId: string, body: string) => {
    setInlineError(parentCommentId, null)
    createMutation.mutate(
      { postId, parentCommentId, body },
      {
        onSuccess: () => {
          setInlineError(parentCommentId, null)
          setOpenForm((current) =>
            current?.kind === "reply" && current.commentId === parentCommentId
              ? null
              : current,
          )
        },
        onError: (error) =>
          setInlineError(parentCommentId, errorMessageOf(error)),
      },
    )
  }

  const submitEdit = (commentId: string, body: string) => {
    setInlineError(commentId, null)
    updateMutation.mutate(
      { commentId, body },
      {
        onSuccess: () => {
          setInlineError(commentId, null)
          setOpenForm((current) =>
            current?.kind === "edit" && current.commentId === commentId
              ? null
              : current,
          )
        },
        onError: (error) => setInlineError(commentId, errorMessageOf(error)),
      },
    )
  }

  const handleDelete = (commentId: string) => {
    if (!window.confirm("댓글을 삭제하시겠어요?")) return
    setInlineError(commentId, null)
    softDeleteMutation.mutate(
      { commentId },
      {
        onSuccess: () => setInlineError(commentId, null),
        onError: (error) => setInlineError(commentId, errorMessageOf(error)),
      },
    )
  }

  return (
    <section className="grid gap-6 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-8">
      <h2 className="font-semibold text-lg">댓글</h2>

      {isAuthenticated ? (
        <CommentForm
          submitLabel="댓글 작성"
          pending={topLevelPending}
          errorMessage={topLevelError}
          onSubmit={submitTopLevel}
        />
      ) : (
        <form action={signInWithGitHub}>
          <button
            type="submit"
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm transition hover:bg-muted"
          >
            댓글을 작성하려면 로그인하세요
          </button>
        </form>
      )}

      <CommentList
        comments={comments}
        openForm={openForm}
        pending={pending}
        inlineErrorByCommentId={inlineErrorByCommentId}
        onStartEdit={(commentId) => setOpenForm({ kind: "edit", commentId })}
        onCancelEdit={() => setOpenForm(null)}
        onSubmitEdit={submitEdit}
        onDelete={handleDelete}
        onStartReply={(commentId) => setOpenForm({ kind: "reply", commentId })}
        onCancelReply={() => setOpenForm(null)}
        onSubmitReply={submitReply}
      />
    </section>
  )
}
