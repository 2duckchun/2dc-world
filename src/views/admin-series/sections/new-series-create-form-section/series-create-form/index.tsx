import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { FormProvider, type UseFormReturn, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import {
  type SeriesCreateInput,
  seriesCreateInputSchema,
} from "@/domain/series/procedure/post-create-series/schema"
import { SeriesDescriptionField } from "./fields/series-description-field"
import { SeriesFormActions } from "./fields/series-form-actions"
import { SeriesSlugInputField } from "./fields/series-slug-input-field"
import { SeriesThumbnailInputField } from "./fields/series-thumbnail-input-field"
import { SeriesTitleField } from "./fields/series-title-field"

const createEmptySeriesFormValues = (): SeriesCreateInput => ({
  title: "",
  slug: "",
  description: null,
  thumbnail: null,
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

export function SeriesCreateForm() {
  const router = useRouter()
  const trpc = useTRPC()
  const form = useForm<SeriesCreateInput>({
    resolver: zodResolver(seriesCreateInputSchema),
    defaultValues: createEmptySeriesFormValues(),
  })
  const { mutate: createSeries, isPending } = useMutation(
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
          createSeries(values)
        })}
        className="grid gap-4"
      >
        <SeriesTitleField />
        <SeriesSlugInputField />
        <SeriesDescriptionField />
        <SeriesThumbnailInputField />
        <SeriesFormActions isPending={isPending} />
      </form>
    </FormProvider>
  )
}
