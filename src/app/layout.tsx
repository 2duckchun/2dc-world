import type { Metadata } from "next"
import { getAuthSession, getViewerSessionFromSession } from "@/core/auth"
import { AppProviders } from "@/core/providers/app-providers"
import { ThemeScript } from "@/core/theme/theme-script"
import { AppShell } from "@/widgets/app-shell/app-shell"
import "./globals.css"

export const metadata: Metadata = {
  title: "2dc world",
  description: "Phase 0 foundation for the 2dc world publishing platform",
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
