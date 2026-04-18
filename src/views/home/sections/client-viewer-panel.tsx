"use client"

import { useViewerCapabilities } from "@/domain/viewer/hook/use-viewer-capabilities"
import { useViewerSession } from "@/domain/viewer/hook/use-viewer-session"

export function ClientViewerPanel() {
  const sessionQuery = useViewerSession()
  const capabilitiesQuery = useViewerCapabilities()

  return (
    <section className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Client-side data layer check
        </h2>
        <p className="text-sm text-muted-foreground">
          This panel reads viewer data through TanStack Query + tRPC from the
          browser.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <pre className="overflow-x-auto rounded-2xl bg-muted p-4 text-xs leading-6 text-muted-foreground">
          {JSON.stringify(sessionQuery.data, null, 2)}
        </pre>
        <pre className="overflow-x-auto rounded-2xl bg-muted p-4 text-xs leading-6 text-muted-foreground">
          {JSON.stringify(capabilitiesQuery.data, null, 2)}
        </pre>
      </div>
    </section>
  )
}
