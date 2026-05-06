import { useId } from "react"
import { Controller, useFormContext } from "react-hook-form"
import type { PostCreatePostInput } from "@/domain/post/procedure/post-create-post/schema"
import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { ThumbnailUrlUploadInput } from "@/widgets/admin/thumbnail-url-upload-input"

export const PostThumbnailInputField = () => {
  const form = useFormContext<PostCreatePostInput>()
  const fieldId = useId()

  return (
    <Controller
      control={form.control}
      name="thumbnail"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={fieldId}>썸네일 URL</FieldLabel>
          <ThumbnailUrlUploadInput
            id={fieldId}
            value={field.value ?? ""}
            onBlur={field.onBlur}
            onChange={field.onChange}
            invalid={fieldState.invalid}
          />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}
