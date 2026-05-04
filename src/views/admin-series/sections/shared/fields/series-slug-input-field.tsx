import { Controller, useFormContext } from "react-hook-form"
import { sanitizeSlugInput } from "@/domain/content/slug"
import type { SeriesCreateInput } from "@/domain/series/procedure/post-create-series/schema"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"

export const SeriesSlugInputField = () => {
  const form = useFormContext<SeriesCreateInput>()
  return (
    <Controller
      control={form.control}
      name="slug"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`slug`}>슬러그</FieldLabel>
          <Input
            {...field}
            id={`slug`}
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
