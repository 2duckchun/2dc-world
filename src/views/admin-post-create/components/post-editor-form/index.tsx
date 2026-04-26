"use client"

import { AlertCircle, Save, UploadCloud } from "lucide-react"
import { Controller } from "react-hook-form"
import {
  postKindLabels,
  postKindValues,
  postStatusLabels,
  postStatusValues,
} from "@/domain/content/types"
import { Button } from "@/shared/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { MarkdownEditor } from "../markdown-editor"
import { usePostEditorForm } from "./post-editor-form-hook"

type SeriesOption = {
  id: string
  title: string
}

type PostEditorFormProps = {
  seriesOptions: SeriesOption[]
}

export function PostEditorForm({ seriesOptions }: PostEditorFormProps) {
  const {
    form,
    handleNullableTextChange,
    handleSeriesOrderChange,
    handleSlugChange,
    handleSubmit,
    isPending,
    isSeriesKind,
    rootError,
  } = usePostEditorForm()

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <section className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="post-title">제목</FieldLabel>
                <Input
                  {...field}
                  id="post-title"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

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
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
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
                    field.onChange(handleSlugChange(event.target.value))
                  }
                />
                <FieldDescription>
                  영문, 숫자, 하이픈(-)만 사용할 수 있습니다.
                </FieldDescription>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="subtitle"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="post-subtitle">부제목</FieldLabel>
                <Input
                  id="post-subtitle"
                  value={field.value ?? ""}
                  onBlur={field.onBlur}
                  onChange={(event) =>
                    field.onChange(handleNullableTextChange(event.target.value))
                  }
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="thumbnail"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="post-thumbnail">썸네일 URL</FieldLabel>
              <Input
                id="post-thumbnail"
                type="url"
                value={field.value ?? ""}
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange(handleNullableTextChange(event.target.value))
                }
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

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

        {isSeriesKind ? (
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
                    onChange={(event) =>
                      field.onChange(
                        handleSeriesOrderChange(event.target.value),
                      )
                    }
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
        ) : null}
      </section>

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

      <div className="flex flex-wrap items-center justify-between gap-3">
        {rootError ? (
          <p
            className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-destructive/35 bg-destructive/10 px-3 py-2 text-destructive text-sm"
            aria-live="polite"
          >
            <AlertCircle className="size-4" />
            {rootError}
          </p>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={isPending} className="min-w-24">
          <Save data-icon="inline-start" className="size-4" />
          {isPending ? "저장 중" : "저장"}
        </Button>
      </div>
    </form>
  )
}
