import type { Metadata } from "next"
import "@mdxeditor/editor/style.css"
import "./globals.css"
import { Toaster } from "sonner"
import { TrpcTanstackQueryProvider } from "@/core/trpc/trpc-tanstack-query-provider"

export const metadata: Metadata = {
  title: {
    default: "2dc world",
    template: "%s | 2dc world",
  },
  description: "Tech, log, and series archive for 2dc world.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full font-sans">
        <TrpcTanstackQueryProvider>
          {children}
          <Toaster />
        </TrpcTanstackQueryProvider>
      </body>
    </html>
  )
}
