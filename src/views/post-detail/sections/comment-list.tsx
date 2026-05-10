"use client"

import { CommentForm } from "./comment-form"
import { type CommentForView, CommentItem } from "./comment-item"

export type CommentTreeNode = CommentForView & {
  replies: CommentForView[]
}

export type OpenForm =
  | { kind: "edit"; commentId: string }
  | { kind: "reply"; commentId: string }
  | null

export type Pending = {
  kind: "edit" | "reply" | "delete"
  id: string
} | null

type CommentListProps = {
  comments: CommentTreeNode[]
  openForm: OpenForm
  pending: Pending
  inlineErrorByCommentId: Record<string, string | null>
  onStartEdit: (commentId: string) => void
  onCancelEdit: () => void
  onSubmitEdit: (commentId: string, body: string) => void
  onDelete: (commentId: string) => void
  onStartReply: (commentId: string) => void
  onCancelReply: () => void
  onSubmitReply: (parentCommentId: string, body: string) => void
}

export function CommentList({
  comments,
  openForm,
  pending,
  inlineErrorByCommentId,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
  onDelete,
  onStartReply,
  onCancelReply,
  onSubmitReply,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">아직 댓글이 없습니다.</p>
    )
  }

  return (
    <ul className="grid gap-6">
      {comments.map((comment) => {
        const isEditing =
          openForm?.kind === "edit" && openForm.commentId === comment.id
        const isReplying =
          openForm?.kind === "reply" && openForm.commentId === comment.id
        const editPending =
          pending?.kind === "edit" && pending.id === comment.id
        const replyPending =
          pending?.kind === "reply" && pending.id === comment.id
        const deletePending =
          pending?.kind === "delete" && pending.id === comment.id

        return (
          <li key={comment.id} className="grid gap-4">
            <CommentItem
              comment={comment}
              isReply={false}
              isEditing={isEditing}
              editError={
                isEditing ? (inlineErrorByCommentId[comment.id] ?? null) : null
              }
              editPending={editPending}
              deletePending={deletePending}
              canReply={!comment.isDeleted}
              onStartEdit={() => onStartEdit(comment.id)}
              onCancelEdit={onCancelEdit}
              onSubmitEdit={(body) => onSubmitEdit(comment.id, body)}
              onDelete={() => onDelete(comment.id)}
              onStartReply={() => onStartReply(comment.id)}
            />

            {isReplying ? (
              <div className="pl-11">
                <CommentForm
                  submitLabel="답글 작성"
                  pending={replyPending}
                  errorMessage={inlineErrorByCommentId[comment.id] ?? null}
                  onSubmit={(body) => onSubmitReply(comment.id, body)}
                  onCancel={onCancelReply}
                  autoFocus
                />
              </div>
            ) : null}

            {comment.replies.length > 0 ? (
              <ul className="grid gap-6">
                {comment.replies.map((reply) => {
                  const isReplyEditing =
                    openForm?.kind === "edit" && openForm.commentId === reply.id
                  const replyEditPending =
                    pending?.kind === "edit" && pending.id === reply.id
                  const replyDeletePending =
                    pending?.kind === "delete" && pending.id === reply.id

                  return (
                    <li key={reply.id}>
                      <CommentItem
                        comment={reply}
                        isReply
                        isEditing={isReplyEditing}
                        editError={
                          isReplyEditing
                            ? (inlineErrorByCommentId[reply.id] ?? null)
                            : null
                        }
                        editPending={replyEditPending}
                        deletePending={replyDeletePending}
                        canReply={false}
                        onStartEdit={() => onStartEdit(reply.id)}
                        onCancelEdit={onCancelEdit}
                        onSubmitEdit={(body) => onSubmitEdit(reply.id, body)}
                        onDelete={() => onDelete(reply.id)}
                        onStartReply={() => {}}
                      />
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
