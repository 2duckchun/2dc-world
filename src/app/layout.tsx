import { GoogleTagManager } from "@next/third-parties/google"
import type { Metadata } from "next"
import "@mdxeditor/editor/style.css"
import "./globals.css"
import { Toaster } from "sonner"
import { TrpcTanstackQueryProvider } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { isProductionEnv } from "@/shared/utils/env"
import {
  GTM_CONTAINER_ID,
  NAVER_SITE_VERIFICATION,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/shared/utils/metadata"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  verification: {
    other: {
      "naver-site-verification": NAVER_SITE_VERIFICATION,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      {isProductionEnv ? <GoogleTagManager gtmId={GTM_CONTAINER_ID} /> : null}
      <body className="min-h-full font-sans">
        <TrpcTanstackQueryProvider>
          {children}
          <Toaster />
        </TrpcTanstackQueryProvider>
      </body>
    </html>
  )
}
