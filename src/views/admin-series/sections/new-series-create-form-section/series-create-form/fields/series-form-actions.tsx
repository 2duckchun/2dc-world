import { AlertCircle, Plus } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type { SeriesCreateInput } from "@/domain/series/procedure/post-create-series/schema"
import { Button } from "@/shared/ui/button"

type SeriesFormActionsProps = {
  isPending: boolean
}

export function SeriesFormActions({ isPending }: SeriesFormActionsProps) {
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
        <Button type="submit" disabled={isPending}>
          <Plus data-icon="inline-start" className="size-4" />
          {isPending ? "저장 중" : "저장"}
        </Button>
      </div>
    </div>
  )
}
