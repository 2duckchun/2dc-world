import { Controller, useFormContext } from "react-hook-form"
import type { PostCreatePostInput } from "@/domain/post/procedure/post-create-post/schema"
import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"

type SeriesOption = {
  id: string
  title: string
}

type PostSeriesFieldsProps = {
  seriesOptions: SeriesOption[]
}

export const PostSeriesFields = ({ seriesOptions }: PostSeriesFieldsProps) => {
  const form = useFormContext<PostCreatePostInput>()
  const kind = form.watch("kind")

  if (kind !== "series") {
    return null
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
      <Controller
        control={form.control}
        name="seriesId"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="post-series">시리즈</FieldLabel>
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger
                id="post-series"
                aria-invalid={fieldState.invalid}
                className="w-full"
              >
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {seriesOptions.map((series) => (
                  <SelectItem key={series.id} value={series.id}>
                    {series.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="seriesOrder"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="post-series-order">순서</FieldLabel>
            <Input
              id="post-series-order"
              type="number"
              min={1}
              value={field.value ?? ""}
              onBlur={field.onBlur}
              onChange={(event) => {
                const value = event.target.value

                field.onChange(value ? Number(value) : null)
              }}
              aria-invalid={fieldState.invalid}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </div>
  )
}
