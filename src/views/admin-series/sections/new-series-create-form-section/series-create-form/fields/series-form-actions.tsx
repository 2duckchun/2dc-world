import { AlertCircle, RotateCcw } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type { SeriesCreateInput } from "@/domain/series/procedure/post-create-series/schema"
import { Button } from "@/shared/ui/button"

export function SeriesFormActions({
  isPending,
  submitLabel,
  submitIcon,
  canReset = false,
  deleteButton,
}: {
  isPending: boolean
  submitLabel: string
  submitIcon: React.ReactNode
  canReset?: boolean
  deleteButton?: React.ReactNode
}) {
  const form = useFormContext<SeriesCreateInput>()
  const rootError = form.formState.errors.root?.message

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
        {canReset ? (
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              form.reset()
              form.clearErrors()
            }}
          >
            <RotateCcw data-icon="inline-start" className="size-4" />
            되돌리기
          </Button>
        ) : null}
        <Button type="submit" disabled={isPending}>
          {submitIcon}
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
