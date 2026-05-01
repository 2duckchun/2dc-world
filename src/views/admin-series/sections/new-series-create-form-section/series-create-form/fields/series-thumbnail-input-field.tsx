import { Controller, useFormContext } from "react-hook-form"
import type { SeriesCreateInput } from "@/domain/series/procedure/post-create-series/schema"
import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"

export const SeriesThumbnailInputField = () => {
  const form = useFormContext<SeriesCreateInput>()

  return (
    <Controller
      control={form.control}
      name="thumbnail"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="series-thumbnail">썸네일 URL</FieldLabel>
          <Input
            id="series-thumbnail"
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
