import type { Metadata } from "next"
import "@mdxeditor/editor/style.css"
import "./globals.css"
import { Toaster } from "sonner"
import { TrpcTanstackQueryProvider } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { SITE_NAME } from "@/shared/utils/metadata"

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "2DC가 쓰는 기술 블로그. 깊이 있는 글, 일상적인 개발 로그, 연재 시리즈로 학습과 경험을 기록합니다.",
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
