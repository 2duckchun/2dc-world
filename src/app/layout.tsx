import { GoogleTagManager } from "@next/third-parties/google"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "@mdxeditor/editor/style.css"
import "./globals.css"
import { TrpcTanstackQueryProvider } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { cn } from "@/shared/lib/utils"
import { Toaster } from "@/shared/ui/sonner"
import { ThemeProvider } from "@/shared/ui/theme-provider"
import { isProductionEnv } from "@/shared/utils/env"
import {
  GTM_CONTAINER_ID,
  NAVER_SITE_VERIFICATION,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/shared/utils/metadata"

// Neo둥근모 (SIL OFL 1.1, 라이선스 원문은 ./fonts/OFL.txt)
const neodgm = localFont({
  src: "./fonts/neodgm.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-neodgm",
})

const neodgmCode = localFont({
  src: "./fonts/neodgm_code.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-neodgm-code",
})

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
    <html
      lang="ko"
      className={cn(neodgm.variable, neodgmCode.variable, "h-full antialiased")}
      suppressHydrationWarning
    >
      {isProductionEnv ? <GoogleTagManager gtmId={GTM_CONTAINER_ID} /> : null}
      <body className="min-h-full font-sans">
        <ThemeProvider>
          <TrpcTanstackQueryProvider>
            {children}
            <Toaster />
          </TrpcTanstackQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
