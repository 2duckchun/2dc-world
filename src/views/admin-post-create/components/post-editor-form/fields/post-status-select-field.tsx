import { Controller, useFormContext } from "react-hook-form"
import { postStatusLabels, postStatusValues } from "@/domain/content/types"
import type { PostCreatePostInput } from "@/domain/post/procedure/post-create-post/schema"
import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"

export const PostStatusSelectField = () => {
  const form = useFormContext<PostCreatePostInput>()

  return (
    <Controller
      control={form.control}
      name="status"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="post-status">상태</FieldLabel>
          <Select
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger
              id="post-status"
              aria-invalid={fieldState.invalid}
              className="w-full"
            >
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              {postStatusValues.map((status) => (
                <SelectItem key={status} value={status}>
                  {postStatusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}
