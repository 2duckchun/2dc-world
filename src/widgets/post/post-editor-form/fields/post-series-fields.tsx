import { useSuspenseQuery } from "@tanstack/react-query"
import { Layers3 } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import type { PostCreatePostInput } from "@/domain/post/procedure/post-create-post/schema"
import { buttonVariants } from "@/shared/ui/button"
import { Field, FieldError, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"

export const PostSeriesFields = () => {
  const trpc = useTRPC()
  const { data: seriesOptions } = useSuspenseQuery(
    trpc.series.getOptions.queryOptions(),
  )
  const form = useFormContext<PostCreatePostInput>()
  const kind = form.watch("kind")

  if (kind !== "series") {
    return null
  }

  if (seriesOptions.length === 0) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background p-4">
        <div className="grid gap-1">
          <p className="font-medium text-sm">등록된 시리즈가 없습니다.</p>
          <p className="text-muted-foreground text-sm">
            시리즈 글은 먼저 시리즈를 만든 뒤 회차로 연결합니다.
          </p>
        </div>
        <a
          href="/admin/series"
          className={buttonVariants({ variant: "outline" })}
        >
          <Layers3 data-icon="inline-start" className="size-4" />
          시리즈 만들기
        </a>
      </div>
    )
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
              items={seriesOptions.map((series) => ({
                label: series.title,
                value: series.id,
              }))}
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
