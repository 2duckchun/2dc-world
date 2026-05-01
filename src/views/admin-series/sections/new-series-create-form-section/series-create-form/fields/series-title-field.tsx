import { Controller, useFormContext } from "react-hook-form"
import type { SeriesCreateInput } from "@/domain/series/procedure/post-create-series/schema"
import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"

export const SeriesTitleField = () => {
  const form = useFormContext<SeriesCreateInput>()

  return (
    <Controller
      control={form.control}
      name="title"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`series-title`}>제목</FieldLabel>
          <Input
            {...field}
            id={`series-title`}
            aria-invalid={fieldState.invalid}
          />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}
