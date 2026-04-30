"use client"

import { X } from "lucide-react"
import { type ClipboardEvent, type KeyboardEvent, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { normalizeTagNames } from "@/domain/content/tags"
import type { PostCreatePostInput } from "@/domain/post/procedure/post-create-post/schema"
import { Button } from "@/shared/ui/button"
import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"

const splitTagText = (value: string) =>
  value
    .split(/[,\n]/g)
    .map((part) => part.trim())
    .filter(Boolean)

const mergeTagNames = (
  currentTags: readonly string[],
  nextTags: readonly string[],
) => normalizeTagNames([...currentTags, ...nextTags])

export const PostTagsInputField = () => {
  const form = useFormContext<PostCreatePostInput>()
  const [draft, setDraft] = useState("")

  return (
    <Controller
      control={form.control}
      name="tags"
      render={({ field, fieldState }) => {
        const tags = field.value ?? []

        const commitDraft = (value: string) => {
          const nextTags = splitTagText(value)

          if (nextTags.length === 0) {
            setDraft("")
            return
          }

          field.onChange(mergeTagNames(tags, nextTags))
          setDraft("")
        }

        const removeTag = (index: number) => {
          field.onChange(tags.filter((_, tagIndex) => tagIndex !== index))
        }

        const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
          if (event.nativeEvent.isComposing) {
            return
          }

          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault()
            commitDraft(draft)
          }
        }

        const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
          const pastedText = event.clipboardData.getData("text")

          if (!/[,\n]/.test(pastedText)) {
            return
          }

          event.preventDefault()
          field.onChange(
            mergeTagNames(tags, [
              ...splitTagText(draft),
              ...splitTagText(pastedText),
            ]),
          )
          setDraft("")
        }

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="post-tags">태그</FieldLabel>
            <Input
              id="post-tags"
              name={field.name}
              ref={field.ref}
              value={draft}
              placeholder="React, Next.js"
              onBlur={() => {
                field.onBlur()
                commitDraft(draft)
              }}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              aria-invalid={fieldState.invalid}
            />
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={tag}
                    className="inline-flex h-7 max-w-full items-center gap-1 rounded-lg border border-border bg-muted px-2 text-sm"
                  >
                    <span className="min-w-0 truncate">{tag}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="-mr-1"
                      aria-label={`${tag} 태그 제거`}
                      onClick={() => removeTag(index)}
                    >
                      <X className="size-3" />
                    </Button>
                  </span>
                ))}
              </div>
            ) : null}
            <FieldError errors={[fieldState.error]} />
          </Field>
        )
      }}
    />
  )
}
