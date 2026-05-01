import { Controller, useFormContext } from "react-hook-form"
import type { PostCreatePostInput } from "@/domain/post/procedure/post-create-post/schema"
import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"

export const PostTitleInputField = () => {
  const form = useFormContext<PostCreatePostInput>()

  return (
    <Controller
      control={form.control}
      name="title"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="post-title">제목</FieldLabel>
          <Input {...field} id="post-title" aria-invalid={fieldState.invalid} />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}
