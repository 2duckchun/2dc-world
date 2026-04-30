import { Controller, useFormContext } from "react-hook-form"
import { sanitizeSlugInput } from "@/domain/content/slug"
import type { PostCreatePostInput } from "@/domain/post/procedure/post-create-post/schema"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"

export const PostSlugInputField = () => {
  const form = useFormContext<PostCreatePostInput>()

  return (
    <Controller
      control={form.control}
      name="slug"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="post-slug">슬러그</FieldLabel>
          <Input
            {...field}
            id="post-slug"
            aria-invalid={fieldState.invalid}
            pattern="[A-Za-z0-9-]+"
            onChange={(event) =>
              field.onChange(sanitizeSlugInput(event.target.value))
            }
          />
          <FieldDescription>
            영문, 숫자, 하이픈(-)만 사용할 수 있습니다.
          </FieldDescription>
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}
