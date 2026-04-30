import { UploadCloud } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"
import type { PostCreatePostInput } from "@/domain/post/procedure/post-create-post/schema"
import { Field, FieldError } from "@/shared/ui/field"
import { MarkdownEditor } from "../../../markdown-editor"

export const PostContentMarkdownField = () => {
  const form = useFormContext<PostCreatePostInput>()

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-border border-b px-4 py-3">
        <div className="flex items-center gap-2 font-medium text-sm">
          <UploadCloud className="size-4 text-chart-1" />
          Markdown
        </div>
        <span className="rounded-md border border-border bg-background px-2 py-1 text-muted-foreground text-xs">
          S3
        </span>
      </div>
      <Controller
        control={form.control}
        name="content"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="gap-0">
            <MarkdownEditor
              markdown={field.value}
              onChange={(value) => field.onChange(value)}
              placeholder=""
              trim={false}
            />
            <FieldError errors={[fieldState.error]} className="px-4 pb-4" />
          </Field>
        )}
      />
    </section>
  )
}
