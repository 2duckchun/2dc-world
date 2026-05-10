"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/shared/lib/utils"

const MAX_BODY_LENGTH = 1000

type CommentFormProps = {
  initialBody?: string
  submitLabel: string
  pending: boolean
  errorMessage?: string | null
  onSubmit: (body: string) => void
  onCancel?: () => void
  autoFocus?: boolean
}

export function CommentForm({
  initialBody = "",
  submitLabel,
  pending,
  errorMessage = null,
  onSubmit,
  onCancel,
  autoFocus = false,
}: CommentFormProps) {
  const [body, setBody] = useState(initialBody)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus()
    }
  }, [autoFocus])

  const trimmed = body.trim()
  const tooLong = body.length > MAX_BODY_LENGTH
  const canSubmit = trimmed.length > 0 && !tooLong && !pending

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    onSubmit(trimmed)
  }

  return (
    <form className="grid gap-2" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={3}
        disabled={pending}
        className={cn(
          "w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
        placeholder="댓글을 입력하세요"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span
          className={cn(
            "text-muted-foreground",
            tooLong && "font-medium text-red-500",
          )}
        >
          {body.length.toLocaleString("ko-KR")} /{" "}
          {MAX_BODY_LENGTH.toLocaleString("ko-KR")}
        </span>
        <div className="flex items-center gap-2">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={pending}
              className="rounded-md border border-border bg-background px-3 py-1.5 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              취소
            </button>
          ) : null}
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-md border border-border bg-foreground px-3 py-1.5 text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLabel}
          </button>
        </div>
      </div>
      {errorMessage ? (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      ) : null}
    </form>
  )
}
