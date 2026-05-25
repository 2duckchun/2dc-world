import { GoogleTagManager } from "@next/third-parties/google"
import type { Metadata } from "next"
import "@mdxeditor/editor/style.css"
import "./globals.css"
import { Toaster } from "sonner"
import { TrpcTanstackQueryProvider } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { SITE_NAME, SITE_URL } from "@/shared/utils/metadata"

const GTM_CONTAINER_ID = "GTM-N42DW84B"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "2DC가 쓰는 기술 블로그. 깊이 있는 글, 일상적인 개발 로그, 연재 시리즈로 학습과 경험을 기록합니다.",
  verification: {
    other: {
      "naver-site-verification": "5da2532700825226e569779beb872ba677c13472",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isProduction = process.env.NODE_ENV === "production"

  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      {isProduction ? <GoogleTagManager gtmId={GTM_CONTAINER_ID} /> : null}
      <body className="min-h-full font-sans">
        <TrpcTanstackQueryProvider>
          {children}
          <Toaster />
        </TrpcTanstackQueryProvider>
      </body>
    </html>
  )
}
