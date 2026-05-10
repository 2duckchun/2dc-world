"use client"

import Image from "next/image"
import { CommentForm } from "./comment-form"

const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
})

export type CommentForView = {
  id: string
  body: string
  isDeleted: boolean
  isEdited: boolean
  createdAt: string
  author: { id: string; name: string | null; image: string | null } | null
  canEdit: boolean
  canDelete: boolean
}

type CommentItemProps = {
  comment: CommentForView
  isReply: boolean
  isEditing: boolean
  editError: string | null
  editPending: boolean
  deletePending: boolean
  canReply: boolean
  onStartEdit: () => void
  onCancelEdit: () => void
  onSubmitEdit: (body: string) => void
  onDelete: () => void
  onStartReply: () => void
}

export function CommentItem({
  comment,
  isReply,
  isEditing,
  editError,
  editPending,
  deletePending,
  canReply,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
  onDelete,
  onStartReply,
}: CommentItemProps) {
  const authorName = comment.author?.name ?? "(알 수 없음)"
  const authorImage = comment.author?.image ?? null
  const formattedDate = dateTimeFormatter.format(new Date(comment.createdAt))
  const showActions = !comment.isDeleted && !isEditing

  return (
    <article className={isReply ? "pl-8" : undefined}>
      <div className="flex gap-3">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
          {authorImage ? (
            <Image
              src={authorImage}
              alt=""
              fill
              sizes="32px"
              className="object-cover"
              unoptimized
            />
          ) : null}
        </div>
        <div className="grid min-w-0 flex-1 gap-1">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
            <span className="font-medium text-foreground">{authorName}</span>
            <span>·</span>
            <span>{formattedDate}</span>
            {comment.isEdited ? <span>· 수정됨</span> : null}
          </div>

          {comment.isDeleted ? (
            <p className="text-muted-foreground text-sm italic">
              삭제된 댓글입니다.
            </p>
          ) : isEditing ? (
            <CommentForm
              initialBody={comment.body}
              submitLabel="수정"
              pending={editPending}
              errorMessage={editError}
              onSubmit={onSubmitEdit}
              onCancel={onCancelEdit}
              autoFocus
            />
          ) : (
            <p className="whitespace-pre-wrap break-words text-sm">
              {comment.body}
            </p>
          )}

          {showActions ? (
            <div className="flex flex-wrap gap-3 text-muted-foreground text-xs">
              {canReply ? (
                <button
                  type="button"
                  onClick={onStartReply}
                  disabled={deletePending}
                  className="transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                  답글
                </button>
              ) : null}
              {comment.canEdit ? (
                <button
                  type="button"
                  onClick={onStartEdit}
                  disabled={deletePending}
                  className="transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                  수정
                </button>
              ) : null}
              {comment.canDelete ? (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={deletePending}
                  className="transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                  삭제
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}
