import type { ViewerCapabilities, ViewerSession } from "@/core/auth"
import { ClientViewerPanel } from "./sections/client-viewer-panel"

type HomeViewProps = {
  session: ViewerSession
  capabilities: ViewerCapabilities
}

const phaseZeroChecklist = [
  "Neon + Drizzle database foundation and migration pipeline",
  "GitHub OAuth authentication with owner capability detection",
  "TanStack Query + tRPC providers and server caller structure",
  "Persistent light/dark theme toggle built on the html.dark convention",
  "Shared app shell with BLOG, MEMO, and BOOKLOG navigation",
]

export function HomeView({ session, capabilities }: HomeViewProps) {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
        <div className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
            Blog Phase 0
          </span>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Foundation work is wired into the app shell.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              This page proves the baseline architecture for auth, data access,
              theme persistence, and future blog routes before Phase 1 public
              reading features land.
            </p>
          </div>

          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {phaseZeroChecklist.map((item) => (
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
              Loaded through a server caller so Phase 1 pages can reuse the same
              context.
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
