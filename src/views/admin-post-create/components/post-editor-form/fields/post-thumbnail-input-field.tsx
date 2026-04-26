import { Controller, useFormContext } from "react-hook-form"
import type { PostCreatePostInput } from "@/domain/post/procedure/post-create-post/schema"
import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"

export const PostThumbnailInputField = () => {
  const form = useFormContext<PostCreatePostInput>()

  return (
    <Controller
      control={form.control}
      name="thumbnail"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="post-thumbnail">썸네일 URL</FieldLabel>
          <Input
            id="post-thumbnail"
            type="url"
            value={field.value ?? ""}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(event.target.value || null)}
            aria-invalid={fieldState.invalid}
          />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}
