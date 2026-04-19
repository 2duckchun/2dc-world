import type { Metadata } from "next"
import { getAuthSession, getViewerSessionFromSession } from "@/core/auth"
import { AppProviders } from "@/core/providers/app-providers"
import { ThemeScript } from "@/core/theme/theme-script"
import { AppShell } from "@/widgets/app-shell/app-shell"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "2dc world",
    template: "%s | 2dc world",
  },
  description:
    "A reading-first publishing space for essays, memos, and ordered booklogs.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getAuthSession()
  const viewerSession = getViewerSessionFromSession(session)

  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full font-sans">
        <ThemeScript />
        <AppProviders session={session}>
          <AppShell session={viewerSession}>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  )
}
