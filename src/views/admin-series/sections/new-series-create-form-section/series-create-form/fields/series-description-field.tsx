import { Controller, useFormContext } from "react-hook-form"
import type { SeriesCreateInput } from "@/domain/series/procedure/post-create-series/schema"
import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { Textarea } from "@/shared/ui/textarea"

export const SeriesDescriptionField = () => {
  const form = useFormContext<SeriesCreateInput>()

  return (
    <Controller
      control={form.control}
      name="description"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="series-description">설명</FieldLabel>
          <Textarea
            id="series-description"
            value={field.value ?? ""}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(event.target.value || null)}
            aria-invalid={fieldState.invalid}
            className="min-h-24"
          />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}
