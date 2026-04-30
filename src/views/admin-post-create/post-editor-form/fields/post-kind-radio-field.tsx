import { Controller, useFormContext } from "react-hook-form"
import { postKindLabels, postKindValues } from "@/domain/content/types"
import type { PostCreatePostInput } from "@/domain/post/procedure/post-create-post/schema"
import {
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/ui/field"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"

export const PostKindRadioField = () => {
  const form = useFormContext<PostCreatePostInput>()

  return (
    <Controller
      control={form.control}
      name="kind"
      render={({ field, fieldState }) => (
        <FieldSet data-invalid={fieldState.invalid}>
          <FieldLegend variant="label">분류</FieldLegend>
          <RadioGroup
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
            className="grid grid-cols-3 gap-2"
          >
            {postKindValues.map((value) => (
              <FieldLabel
                key={value}
                className="flex min-h-10 cursor-pointer items-center rounded-lg border border-border bg-background px-3 py-2 text-muted-foreground transition has-data-checked:border-primary/40 has-data-checked:bg-primary/10 has-data-checked:text-foreground"
              >
                <RadioGroupItem value={value} />
                <span className="min-w-0 truncate">
                  {postKindLabels[value]}
                </span>
              </FieldLabel>
            ))}
          </RadioGroup>
          <FieldError errors={[fieldState.error]} />
        </FieldSet>
      )}
    />
  )
}
