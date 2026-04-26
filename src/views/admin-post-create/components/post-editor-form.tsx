"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { AlertCircle, Save, UploadCloud } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Controller, type Resolver, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { sanitizeSlugInput } from "@/domain/content/slug"
import {
  postKindLabels,
  postKindValues,
  postStatusLabels,
  postStatusValues,
} from "@/domain/content/types"
import {
  type PostCreatePostInput,
  postCreatePostInputSchema,
} from "@/domain/post/procedure/post-create-post/schema"
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
import { MarkdownEditor } from "./markdown-editor"

type SeriesOption = {
  id: string
  title: string
}

type PostEditorFormProps = {
  seriesOptions: SeriesOption[]
}

const defaultMarkdown = `# 제목

본문을 작성하세요.
`

// pnpm keeps a secondary zod copy for transitive tooling, so the resolver
// package's Zod v4 type identity differs from the app schema's type identity.
const postCreatePostResolver = zodResolver(
  postCreatePostInputSchema as never,
) as Resolver<PostCreatePostInput>

export function PostEditorForm({ seriesOptions }: PostEditorFormProps) {
  const router = useRouter()
  const trpc = useTRPC()
  const form = useForm<PostCreatePostInput>({
    resolver: postCreatePostResolver,
    defaultValues: {
      title: "",
      slug: "",
      subtitle: null,
      thumbnail: null,
      content: defaultMarkdown,
      kind: "post",
      status: "draft",
      seriesId: null,
      seriesOrder: null,
    },
  })
  const selectedKind = form.watch("kind")
  const isSeriesKind = selectedKind === "series"
  const createPost = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: () => {
        toast.success("게시글을 저장했습니다.")
        router.push("/")
      },
      onError: (error) => {
        const message =
          error.message || "게시글 저장에 실패했습니다. 다시 시도해 주세요."

        form.setError("root", { type: "server", message })

        if (message.includes("슬러그")) {
          form.setError("slug", { type: "server", message })
        }

        toast.error(message)
      },
    }),
  )
  const isPending = createPost.isPending
  const rootError = form.formState.errors.root?.message

  useEffect(() => {
    if (isSeriesKind) {
      return
    }

    form.setValue("seriesId", null)
    form.setValue("seriesOrder", null)
    form.clearErrors(["seriesId", "seriesOrder"])
  }, [form, isSeriesKind])

  return (
    <form
      onSubmit={form.handleSubmit((values) => {
        form.clearErrors("root")
        createPost.mutate(values)
      })}
      className="grid gap-6"
    >
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
                    field.onChange(event.target.value || null)
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
                onChange={(event) => field.onChange(event.target.value || null)}
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
