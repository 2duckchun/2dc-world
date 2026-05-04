import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormProvider, type UseFormReturn, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import {
  type SeriesCreateInput,
  seriesCreateInputSchema,
} from "@/domain/series/procedure/post-create-series/schema"
import { Button } from "@/shared/ui/button"
import { SeriesDescriptionField } from "../../shared/fields/series-description-field"
import { SeriesFormActions } from "../../shared/fields/series-form-actions"
import { SeriesSlugInputField } from "../../shared/fields/series-slug-input-field"
import { SeriesThumbnailInputField } from "../../shared/fields/series-thumbnail-input-field"
import { SeriesTitleField } from "../../shared/fields/series-title-field"
import type { SeriesListItem } from "../../shared/types"

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

export const SeriesEditForm = ({ series }: { series: SeriesListItem }) => {
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
        <SeriesTitleField />
        <SeriesSlugInputField />
        <SeriesDescriptionField />
        <SeriesThumbnailInputField />
        <SeriesFormActions
          isPending={isActionPending}
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
        />
      </form>
    </FormProvider>
  )
}
