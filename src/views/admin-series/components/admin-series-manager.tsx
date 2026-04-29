"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { AlertCircle, Plus, RotateCcw, Save, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Controller,
  FormProvider,
  type UseFormReturn,
  useForm,
} from "react-hook-form"
import { toast } from "sonner"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { sanitizeSlugInput } from "@/domain/content/slug"
import type { SeriesListOutput } from "@/domain/series/procedure/get-list/schema"
import {
  type SeriesCreateInput,
  seriesCreateInputSchema,
} from "@/domain/series/procedure/post-create-series/schema"
import { Button } from "@/shared/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"

type SeriesListItem = SeriesListOutput[number]

type AdminSeriesManagerProps = {
  series: SeriesListOutput
}

const createEmptySeriesFormValues = (): SeriesCreateInput => ({
  title: "",
  slug: "",
  description: null,
  thumbnail: null,
})

const getSeriesFormValues = (series: SeriesListItem): SeriesCreateInput => ({
  title: series.title,
  slug: series.slug,
  description: series.description,
  thumbnail: series.thumbnail,
})

const setServerError = (
  form: UseFormReturn<SeriesCreateInput>,
  message: string,
) => {
  form.setError("root", { type: "server", message })

  if (message.includes("슬러그")) {
    form.setError("slug", { type: "server", message })
  }
}

export function AdminSeriesManager({ series }: AdminSeriesManagerProps) {
  return (
    <div className="grid gap-5">
      <section className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-1">
          <h2 className="font-bold text-xl leading-tight">새 시리즈</h2>
          <p className="text-muted-foreground text-sm">
            시리즈를 만든 뒤 글쓰기 화면에서 회차를 연결합니다.
          </p>
        </div>
        <SeriesCreateForm />
      </section>

      <section className="grid gap-4" aria-label="시리즈 목록">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold text-xl leading-tight">시리즈 목록</h2>
          <p className="text-muted-foreground text-sm">
            전체 {series.length.toLocaleString("ko-KR")}개
          </p>
        </div>

        {series.length > 0 ? (
          <div className="grid gap-4">
            {series.map((seriesItem) => (
              <SeriesEditCard key={seriesItem.id} series={seriesItem} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-36 items-center rounded-lg border border-border bg-card p-5 text-muted-foreground shadow-sm">
            아직 등록된 시리즈가 없습니다.
          </div>
        )}
      </section>
    </div>
  )
}

function SeriesCreateForm() {
  const router = useRouter()
  const trpc = useTRPC()
  const form = useForm<SeriesCreateInput>({
    resolver: zodResolver(seriesCreateInputSchema),
    defaultValues: createEmptySeriesFormValues(),
  })
  const createSeries = useMutation(
    trpc.series.create.mutationOptions({
      onSuccess: () => {
        toast.success("시리즈를 저장했습니다.")
        form.reset(createEmptySeriesFormValues())
        router.refresh()
      },
      onError: (error) => {
        const message =
          error.message || "시리즈 저장에 실패했습니다. 다시 시도해 주세요."

        setServerError(form, message)
        toast.error(message)
      },
    }),
  )

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          form.clearErrors("root")
          createSeries.mutate(values)
        })}
        className="grid gap-4"
      >
        <SeriesFormFields form={form} idPrefix="series-create" />
        <SeriesFormActions
          isPending={createSeries.isPending}
          rootError={form.formState.errors.root?.message}
          submitLabel={createSeries.isPending ? "저장 중" : "저장"}
          submitIcon={<Plus data-icon="inline-start" className="size-4" />}
        />
      </form>
    </FormProvider>
  )
}

function SeriesEditCard({ series }: { series: SeriesListItem }) {
  return (
    <article className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h3 className="font-bold text-lg leading-tight">{series.title}</h3>
          <a
            href={`/series/${series.slug}`}
            className="w-fit text-muted-foreground text-sm transition hover:text-foreground hover:underline"
          >
            /series/{series.slug}
          </a>
        </div>
        <span className="rounded-lg border border-border bg-background px-2.5 py-1 font-medium text-muted-foreground text-sm">
          {series.episodeCount.toLocaleString("ko-KR")}회차
        </span>
      </div>
      <SeriesEditForm series={series} />
    </article>
  )
}

function SeriesEditForm({ series }: { series: SeriesListItem }) {
  const router = useRouter()
  const trpc = useTRPC()
  const form = useForm<SeriesCreateInput>({
    resolver: zodResolver(seriesCreateInputSchema),
    defaultValues: getSeriesFormValues(series),
  })
  const updateSeries = useMutation(
    trpc.series.update.mutationOptions({
      onSuccess: (_result, values) => {
        toast.success("시리즈를 수정했습니다.")
        form.reset(values)
        router.refresh()
      },
      onError: (error) => {
        const message =
          error.message || "시리즈 수정에 실패했습니다. 다시 시도해 주세요."

        setServerError(form, message)
        toast.error(message)
      },
    }),
  )
  const deleteSeries = useMutation(
    trpc.series.delete.mutationOptions({
      onSuccess: (result) => {
        if (result.deletedPostCount > 0) {
          toast.success(
            `시리즈와 연결된 ${result.deletedPostCount.toLocaleString("ko-KR")}개 글을 삭제했습니다.`,
          )
        } else {
          toast.success("시리즈를 삭제했습니다.")
        }

        router.refresh()
      },
      onError: (error) => {
        toast.error(error.message || "시리즈 삭제에 실패했습니다.")
      },
    }),
  )
  const isActionPending = updateSeries.isPending || deleteSeries.isPending
  const deleteConfirmationMessage =
    series.episodeCount > 0
      ? `이 시리즈와 연결된 ${series.episodeCount.toLocaleString("ko-KR")}개 글을 모두 삭제할까요? 이 작업은 되돌릴 수 없습니다.`
      : "이 시리즈를 삭제할까요?"

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          form.clearErrors("root")
          updateSeries.mutate({ id: series.id, ...values })
        })}
        className="grid gap-4"
      >
        <SeriesFormFields form={form} idPrefix={`series-${series.id}`} />
        <SeriesFormActions
          isPending={isActionPending}
          rootError={form.formState.errors.root?.message}
          submitLabel={updateSeries.isPending ? "수정 중" : "수정 저장"}
          submitIcon={<Save data-icon="inline-start" className="size-4" />}
          deleteButton={
            <Button
              type="button"
              variant="destructive"
              disabled={isActionPending}
              onClick={() => {
                const confirmed = window.confirm(deleteConfirmationMessage)

                if (!confirmed) {
                  return
                }

                deleteSeries.mutate({ id: series.id })
              }}
            >
              <Trash2 data-icon="inline-start" className="size-4" />
              {deleteSeries.isPending ? "삭제 중" : "삭제"}
            </Button>
          }
          resetButton={
            <Button
              type="button"
              variant="outline"
              disabled={isActionPending}
              onClick={() => {
                form.reset(getSeriesFormValues(series))
                form.clearErrors()
              }}
            >
              <RotateCcw data-icon="inline-start" className="size-4" />
              되돌리기
            </Button>
          }
        />
      </form>
    </FormProvider>
  )
}

function SeriesFormFields({
  form,
  idPrefix,
}: {
  form: UseFormReturn<SeriesCreateInput>
  idPrefix: string
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${idPrefix}-title`}>제목</FieldLabel>
              <Input
                {...field}
                id={`${idPrefix}-title`}
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="slug"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${idPrefix}-slug`}>슬러그</FieldLabel>
              <Input
                {...field}
                id={`${idPrefix}-slug`}
                aria-invalid={fieldState.invalid}
                pattern="[A-Za-z0-9-]+"
                onChange={(event) =>
                  field.onChange(sanitizeSlugInput(event.target.value))
                }
              />
              <FieldDescription>
                영문, 숫자, 하이픈(-)만 사용할 수 있습니다.
              </FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>

      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`${idPrefix}-description`}>설명</FieldLabel>
            <Textarea
              id={`${idPrefix}-description`}
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

      <Controller
        control={form.control}
        name="thumbnail"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`${idPrefix}-thumbnail`}>
              썸네일 URL
            </FieldLabel>
            <Input
              id={`${idPrefix}-thumbnail`}
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
    </div>
  )
}

function SeriesFormActions({
  isPending,
  rootError,
  submitLabel,
  submitIcon,
  deleteButton,
  resetButton,
}: {
  isPending: boolean
  rootError?: string
  submitLabel: string
  submitIcon: React.ReactNode
  deleteButton?: React.ReactNode
  resetButton?: React.ReactNode
}) {
  return (
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
      <div className="flex flex-wrap items-center gap-2">
        {deleteButton}
        {resetButton}
        <Button type="submit" disabled={isPending}>
          {submitIcon}
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
