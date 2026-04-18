import type { ViewerCapabilities, ViewerSession } from "@/core/auth"
import { ClientViewerPanel } from "./sections/client-viewer-panel"

type HomeViewProps = {
  session: ViewerSession
  capabilities: ViewerCapabilities
}

const phaseOneChecklist = [
  "Neon + Drizzle schema now includes public reading models",
  "GitHub OAuth owner detection is still active for authoring phases",
  "TanStack Query + tRPC power both server and client reads",
  "Markdown-based public reading routes are wired for blog, memo, booklog, tags, and series",
  "Shared app shell continues to host the public reading experience",
]

export function HomeView({ session, capabilities }: HomeViewProps) {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
        <div className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
            Blog Phase 1
          </span>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Public reading is ready to grow on top of the shared foundation.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              The app now has a real read model for blog, memo, booklog, tags,
              and series pages while preserving the owner-aware infrastructure
              needed for authoring in the next phase.
            </p>
          </div>

          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {phaseOneChecklist.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-border bg-background px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Server-side viewer context
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Viewer capabilities remain available so owner-only authoring can
              build on the same context in the next phase.
            </p>
          </div>

          <dl className="grid gap-3 text-sm">
            <div className="rounded-2xl bg-muted px-4 py-3">
              <dt className="text-muted-foreground">Role</dt>
              <dd className="mt-1 font-medium text-foreground">
                {session.role}
              </dd>
            </div>
            <div className="rounded-2xl bg-muted px-4 py-3">
              <dt className="text-muted-foreground">Authenticated</dt>
              <dd className="mt-1 font-medium text-foreground">
                {String(session.isAuthenticated)}
              </dd>
            </div>
            <div className="rounded-2xl bg-muted px-4 py-3">
              <dt className="text-muted-foreground">Can write</dt>
              <dd className="mt-1 font-medium text-foreground">
                {String(capabilities.canWrite)}
              </dd>
            </div>
            <div className="rounded-2xl bg-muted px-4 py-3">
              <dt className="text-muted-foreground">Viewer</dt>
              <dd className="mt-1 font-medium text-foreground">
                {session.user?.name ??
                  session.user?.email ??
                  "Anonymous visitor"}
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      <ClientViewerPanel />
    </div>
  )
}
