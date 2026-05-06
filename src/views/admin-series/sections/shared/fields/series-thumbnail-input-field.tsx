import { useId } from "react"
import { Controller, useFormContext } from "react-hook-form"
import type { SeriesCreateInput } from "@/domain/series/procedure/post-create-series/schema"
import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { ThumbnailUrlUploadInput } from "@/widgets/admin/thumbnail-url-upload-input"

export const SeriesThumbnailInputField = () => {
  const form = useFormContext<SeriesCreateInput>()
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
